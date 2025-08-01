import React, { useState, useEffect, useCallback } from 'react';
import Group from '../Group/Group';
import './GroupsPage.css';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import UserService from '../services/user-service';
import { debounce } from 'lodash';
import { CircularProgress } from '@mui/material';
import CreatGroup from '../CreatGroup/CreatGroup';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api-client';

interface GroupType {
  id: number;
  title: string;
  description: string;
  level: string;
  city: string | null;
  neighborhood: string | null;
  created_at: string;
  meeting_url: string;
  private: boolean;
  member_count: string;
  requested: boolean;
  owner_username: string; // Added to track the group's owner
}

type Tab = 'allGroups' | 'myGroups' | 'suggestions';

const GroupsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('allGroups');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMoreGroups, setHasMoreGroups] = useState<boolean>(true);
  const [sortField, setSortField] = useState<string>('title');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [localUsername, setLocalUsername] = useState<string>(''); // Stores the logged-in user's username
  const [groupOwners, setGroupOwners] = useState<{ [key: string]: string }>({}); // Stores owner usernames for each group
  const navigate = useNavigate();
  const debouncedSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleGroupClick = (groupTitle: string) => {
    navigate(`/main-group-window/${groupTitle}`);
  };

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const userToken = localStorage.getItem('token');

      if (!userToken) {
        setError('User is not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      let response;
      const params: Record<string, any> = {
        ordering: sortOrder === 'asc' ? sortField : `-${sortField}`,
        page: currentPage,
        page_size: 4,
      };

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if ((activeTab === 'allGroups' || activeTab === 'myGroups') && level) {
        params.level = level;
      }

      switch (activeTab) {
        case 'allGroups':
          response = await UserService.fetchAllGroups(userToken, params);
          break;
        case 'suggestions':
          response = await UserService.fetchAllSuggestionsGroups(userToken);
          break;
        case 'myGroups':
          response = await UserService.fetchMyGroups(userToken, params);
          break;
        default:
          throw new Error('Unknown tab selected.');
      }

      if (response.data.results) {
        const filteredResults = response.data.results.filter((group: GroupType) =>
          group.title.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
        setGroups(filteredResults);
        setHasMoreGroups(filteredResults.length > 0);

        // Fetch owner usernames for each group
        filteredResults.forEach((group: { title: string; }) => {
          GetGroupInfo(group.title);
        });
      } else {
        setGroups([]);
        setHasMoreGroups(false);
      }

      setLoading(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to fetch groups. Please try again later.'
      );
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const userToken = localStorage.getItem('token');
      if (!userToken) {
        setError('User is not authenticated. Please log in.');
        return;
      }

      const response = await UserService.UserProfileInfo(userToken);
      setLocalUsername(response.data.username); // Store the logged-in user's username
    } catch (err: any) {
      console.error('Error fetching user info:', err.message);
      setError('Failed to fetch user info.');
    }
  };

  const GetGroupInfo = (Title: string) => {
    apiClient
      .get(`/groups/${Title}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        // Update the groupOwners state with the owner username for this group
        setGroupOwners((prev) => ({
          ...prev,
          [Title]: res.data.owner_username,
        }));
      })
      .catch((err) => {
        console.error('Error fetching group info:', err.message);
      });
  };

  useEffect(() => {
    fetchUserInfo(); // Fetch the logged-in user's information
    fetchGroups(); // Fetch the groups
  }, [activeTab, level, searchTerm, currentPage, sortField, sortOrder]);

  const goToNextPage = () => {
    if (hasMoreGroups) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const sortedGroups = [...groups].sort((a, b) => {
    const fieldA = a[sortField as keyof GroupType];
    const fieldB = b[sortField as keyof GroupType];

    if (fieldA && fieldB) {
      if (sortOrder === 'asc') {
        return fieldA.toString().localeCompare(fieldB.toString());
      } else {
        return fieldB.toString().localeCompare(fieldA.toString());
      }
    }
    return 0;
  });

  const handleGroupAction = async (group: GroupType, action: 'join' | 'leave') => {
    try {
      const userToken = localStorage.getItem('token');
      if (!userToken) {
        setError('User is not authenticated. Please log in.');
        return;
      }

      setLoading(true);

      if (action === 'join') {
        if (group.requested) {
          const res = await UserService.cancelJoinRequest(userToken, group.title);
          if (res.data === 'Request canceled successfully') {
            setGroups((prevGroups) =>
              prevGroups.map((g) =>
                g.id === group.id ? { ...g, requested: false } : g
              )
            );
          }
        } else {
          const res = await UserService.joinGroup(userToken, group.title);
          if (res.data === 'Request sent successfully') {
            setGroups((prevGroups) =>
              prevGroups.map((g) =>
                g.id === group.id ? { ...g, requested: true } : g
              )
            );
          }
        }
      } else if (action === 'leave') {
        await UserService.leaveGroup(userToken, group.title);
      }

      await fetchGroups();

      setLoading(false);
    } catch (err: any) {
      console.error('Error performing group action:', err);
      setError('Failed to perform action on group.');
      setLoading(false);
    }
  };

  return (
    <div className="groups-page">
      <div className="filters">
        <div className="search-container">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            className="search-bar"
            placeholder="Search"
            onChange={(e) => {
              debouncedSearchTerm(e.target.value);
            }}
          />
        </div>
        {(activeTab === 'allGroups' || activeTab === 'myGroups') && (
          <div className="level-filter">
            <label htmlFor="level-select">Level:</label>
            <select
              id="level-select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>
        )}
        <div className="name-sort">
          <label htmlFor="sort-field" className="sort-name-label">
            Sort
          </label>
          <select
            id="sort-field"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="title">Name</option>
            <option value="level">Level</option>
          </select>

          <label htmlFor="sort-order">Order:</label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="tabs">
        <div className="tab-buttons">
          <button
            className={`tab ${activeTab === 'allGroups' ? 'active' : ''}`}
            onClick={() => handleTabChange('allGroups')}
          >
            All Groups
          </button>
          <button
            className={`tab ${activeTab === 'myGroups' ? 'active' : ''}`}
            onClick={() => handleTabChange('myGroups')}
          >
            My Groups
          </button>
          <button
            className={`tab ${activeTab === 'suggestions' ? 'active' : ''}`}
            onClick={() => handleTabChange('suggestions')}
          >
            Suggestions
          </button>
        </div>
        <CreatGroup />
      </div>

      <div className="group-list">
        {loading && (
          <p className="circular_progress">
            <CircularProgress className="Circular" />
          </p>
        )}
        {error && <p className="error">{error}</p>}
        {!loading && !error && sortedGroups.length === 0 && <p>No groups found.</p>}
        {!loading &&
          !error &&
          sortedGroups.map((group) => (
            <div
              key={group.id}
              onClick={() =>
                activeTab === 'myGroups' ? handleGroupClick(group.title) : null
              }
              style={{ cursor: 'pointer' }}
            >
              <Group
                id={group.id}
                name={group.title}
                lastMessage={group.description}
                time={new Date(group.created_at).toLocaleString()}
                avatarUrl="https://mr.assets.gameloft.com/images/hi-res/section3/minion-bob.png"
                actionLabel={
                  groupOwners[group.title] === localUsername // Check if the user is the owner
                    ? 'Owner' // Show "Owner" badge
                    : activeTab === 'myGroups'
                    ? 'Leave'
                    : group.requested
                    ? 'Requested'
                    : 'Join'
                }
                onAction={(e) => {
                  e.stopPropagation();
                  if (groupOwners[group.title] !== localUsername) {
                    handleGroupAction(
                      group,
                      activeTab === 'myGroups' ? 'leave' : 'join'
                    );
                  }
                }}
              />
            </div>
          ))}
      </div>

      <div className="pagination" style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          style={{ border: 'none', background: 'none', cursor: 'pointer' }}
        >
          <ArrowBackIcon
            style={{ fontSize: '24px', color: currentPage === 1 ? '#ccc' : '#000' }}
          />
        </button>
        <span style={{ margin: '0 15px' }}>Page {currentPage}</span>
        <button
          onClick={goToNextPage}
          disabled={!hasMoreGroups}
          style={{ border: 'none', background: 'none', cursor: 'pointer' }}
        >
          <ArrowForwardIcon
            style={{ fontSize: '24px', color: !hasMoreGroups ? '#ccc' : '#000' }}
          />
        </button>
      </div>
    </div>
  );
};

export default GroupsPage;
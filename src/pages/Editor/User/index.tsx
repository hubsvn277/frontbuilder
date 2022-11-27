import { FaUserCircle } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import FloatingMenu from '@components/FloatingMenu';
import styled from 'styled-components';
import * as G from '@src/styles';
import { COLORS } from '@src/global/variables';
import useUser from '@src/hooks/useUser';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const [userIsVisible, showUser] = useState(false);
  const { user, signOut, fetchUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (userIsVisible) {
      fetchUser();
    }
  }, [userIsVisible, fetchUser]);

  const handleSignOut = () => {
    signOut();
    navigate('/signIn');
  };

  return (
    <FloatingMenu
      content={<UserProfile user={user} signOut={handleSignOut} />}
      visible={userIsVisible}
      onClickOutside={() => showUser(false)}
      showArrow={false}
      placement={'right-start'}
    >
      <div>
        <FaUserCircle
          size={23}
          onClick={() => showUser((s) => !s)}
          cursor={'pointer'}
        />
      </div>
    </FloatingMenu>
  );
};

export default User;

const UserProfile = ({ user, signOut }: any) => {
  return (
    <>
      <Container>
        <FaUserCircle size={40} />
        <Label>{user?.full_name}</Label>
        <SubLabel>{user?.email}</SubLabel>
      </Container>
      <G.Divider />
      <div>
        <MenuItem>Update Profile</MenuItem>
        <MenuItem>Update Password</MenuItem>
        <MenuItem>Sign Out</MenuItem>
      </div>
      <G.Divider />
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  width: 230px;
  gap: 10px 3px;
  color: whitesmoke;
`;

const MenuItem = styled.div`
  color: #d0cccc;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
  padding: 8px 7px;

  &:hover {
    background-color: ${COLORS.MENU_HOVER};
  }
`;

const Label = styled.div`
  font-size: 16px;
`;

const SubLabel = styled.div`
  font-size: 11px;
  color: #d0cccc;
`;

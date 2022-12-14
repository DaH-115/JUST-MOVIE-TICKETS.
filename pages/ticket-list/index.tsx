import { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { db } from 'firebase-config';
import {
  collection,
  DocumentData,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import styled from 'styled-components';

import withHeadMeta from 'components/common/withHeadMeta';
import BackgroundStyle from 'components/layout/BackgroundStyle';
import UserTicketSlider from 'components/user-ticket/UserTicketSlider';
import SlideList from 'components/slider/SlideList';
import NoneResults from 'components/styles/NoneReults';
import { useAuthState } from 'components/store/auth-context';
import { UserTicketProps } from 'ticketType';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { LoadingSpinner } from 'components/common/LoadingSpinner';

const TicketListPage: NextPage = () => {
  const { userId, isSigned } = useAuthState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usersTicket, setUsersTicket] = useState<UserTicketProps[]>([]);
  const ticketLength = usersTicket.length;
  const router = useRouter();
  // false -> desc / true -> asc
  const [isSorted, setIsSorted] = useState<boolean>(false);

  const onSortedHandler = useCallback(() => {
    setIsSorted((prev) => !prev);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const ticketRef = collection(db, 'users-tickets');
      const contentQuery = query(
        ticketRef,
        where('creatorId', '==', `${userId}`),
        orderBy('createdAt', `${!isSorted ? 'desc' : 'asc'}`)
      );
      const dbContents = await getDocs(contentQuery);

      const newData = dbContents.docs.map((item: DocumentData) => ({
        id: item.id,
        ...item.data(),
      }));

      setUsersTicket(newData);
      setIsLoading(false);
    })();
  }, [userId, isSorted]);

  useEffect(() => {
    if (!isSigned) {
      router.push('/');
    }
  }, [isSigned]);

  return (
    <BackgroundStyle customMessage='your????'>
      <SlideList
        title='?????? ??????'
        ticketLength={ticketLength}
        description='????????? ??????????????? ?????? ?????????'
      >
        <SortList onClick={onSortedHandler}>
          <p>{'??????'}</p>
          {!isSorted ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </SortList>
        {isLoading ? (
          <Wrapper>
            <LoadingSpinner />
          </Wrapper>
        ) : (
          <TicketListWrapper>
            {!ticketLength ? (
              <Wrapper>
                <NoneResults>{'?????? ?????? ????????? ????????????.'}</NoneResults>
              </Wrapper>
            ) : (
              <UserTicketSlider movies={usersTicket} />
            )}
          </TicketListWrapper>
        )}
      </SlideList>
    </BackgroundStyle>
  );
};

export default withHeadMeta(TicketListPage, '?????? ??????');

const SortList = styled.div`
  position: absolute;
  top: 10.5rem;
  left: 12rem;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 5.2rem;

  font-weight: 700;
  color: #fff;
  margin-left: 2rem;
  padding: 0.3rem 0.8rem;
  border: 0.1rem solid ${({ theme }) => theme.colors.orange};
  border-radius: 2rem;

  cursor: pointer;

  &:hover,
  &:active {
    background: linear-gradient(
      ${({ theme }) => theme.colors.black} 60%,
      ${({ theme }) => theme.colors.orange}
    );
  }

  p {
    margin-right: 0.3rem;
  }

  ${({ theme }) => theme.device.tablet} {
    top: 10.1rem;
    left: 17rem;
    width: 5rem;
    font-size: 0.8rem;
  }

  ${({ theme }) => theme.device.desktop} {
    top: 14rem;
    left: 16rem;
  }
`;

const TicketListWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100vh;
  margin-top: 1rem;
`;

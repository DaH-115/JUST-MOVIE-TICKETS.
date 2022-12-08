import { useRouter } from 'next/router';
import styled from 'styled-components';
import useGetJanres from '../../hooks/useGetJanres';

import InfoButton from '../ticket/InfoButton';
import PosterImage from '../ticket/PosterImage';
import MovieTicketDetail from '../ticket/MovieTicketDetail';
import { TicketWrapper } from '../styles/TicketWrapper';
import { MovieIndexBar } from '../styles/MovieIndexBar';
import { MovieDataProps } from 'ticketType';

const TopMovieTicket = ({
  movieId,
  releaseDate,
  movieIndex,
  title,
  posterPath,
  voteAverage,
  overview,
}: MovieDataProps) => {
  const router = useRouter();
  const janres = useGetJanres(movieId);
  const releaseYear = releaseDate.slice(0, 4);

  return (
    <TicketWrapper>
      {/* TICKET INDEX HEADER */}
      <MovieIndexBar routePath={router.pathname}>
        <MovieRank>{movieIndex}</MovieRank>

        {/* 🎈 GO TO MOVIE INFO PAGE BUTTON */}
        <InfoButton
          movieId={movieId}
          title={title}
          releaseYear={releaseYear}
          posterPath={posterPath}
          voteAverage={voteAverage}
          janres={janres}
          overview={overview}
        />
      </MovieIndexBar>

      {/* POSTER IMAGE */}
      <PosterImage title={title} posterPath={posterPath} />

      {/* TICKET DETAIL */}
      <MovieTicketDetail
        title={title}
        releaseYear={releaseYear}
        janres={janres}
        voteAverage={voteAverage}
        posterPath={posterPath}
      />
    </TicketWrapper>
  );
};

export default TopMovieTicket;

const MovieRank = styled.p`
  font-size: 3rem;
`;
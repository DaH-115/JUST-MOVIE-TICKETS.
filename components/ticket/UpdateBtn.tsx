import Link from 'next/link';
import { BiPencil } from 'react-icons/bi';
import { WriteFormProps } from 'ticketType';
import StyledBtn from 'components/styles/StyledBtn';

const UpdateBtn = ({
  ticketId,
  title,
  releaseYear,
  rating,
  reviewText,
  posterImage,
}: WriteFormProps) => {
  return (
    <Link
      href={{
        pathname: '/write',
        query: {
          ticketId,
          title,
          releaseYear,
          rating,
          reviewText,
          posterImage,
        },
      }}
      as={`/write`}
    >
      <StyledBtn>
        <button>
          <BiPencil />
        </button>
      </StyledBtn>
    </Link>
  );
};

export default UpdateBtn;

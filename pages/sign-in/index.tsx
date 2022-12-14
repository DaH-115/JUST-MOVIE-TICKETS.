import { useState, useRef, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import { isAuth } from 'firebase-config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithRedirect,
} from 'firebase/auth';
import { useRouter } from 'next/router';
import { SystemError } from 'errorType';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';

import withHeadMeta from 'components/common/withHeadMeta';
import BackgroundStyle from 'components/layout/BackgroundStyle';
import LoadingMsg from 'components/common/LoadingMsg';
import Error from 'next/error';
import { useAuthState } from 'components/store/auth-context';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { isSigned } = useAuthState();
  const [signUp, setSignUp] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  // User EMAIL-PASSWORD Text
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  // Validation State
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const isDisabled = isEmail && isPassword ? false : true;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    inputRef.current!.focus();
  }, []);

  useEffect(() => {
    if (isSigned) {
      router.replace('/');
    }
  }, [isSigned]);

  const getUser = useCallback(async () => {
    setIsLoading(true);

    if (signUp) {
      // Sign Up
      try {
        await createUserWithEmailAndPassword(isAuth, userEmail, userPassword);
      } catch (error) {
        const err = error as SystemError;
        setIsError(true);
        return <Error statusCode={err.statusCode} title={err.message} />;
      }
    } else {
      // Sign In
      try {
        await signInWithEmailAndPassword(isAuth, userEmail, userPassword);
      } catch (error) {
        const err = error as SystemError;
        setIsError(true);
        return <Error statusCode={err.statusCode} title={err.message} />;
      }
    }

    setIsLoading(false);
  }, []);

  const onSubmitHandler = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    getUser();
    setUserEmail('');
    setUserPassword('');
  }, []);

  const onSignUpToggleHandler = useCallback(() => {
    setSignUp((prev) => !prev);
  }, []);

  const onEmailChangeHandler = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      setUserEmail(target.value);

      const emailCheckRegex =
        /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      const emailValue = target.value;

      if (!emailCheckRegex.test(emailValue)) {
        setIsEmail(false);
      } else {
        setIsEmail(true);
      }
    },
    []
  );

  const onPasswordChangeHandler = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      setUserPassword(target.value);

      const passwordCheckRegex =
        /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
      const passwordValue = target.value;

      if (!passwordCheckRegex.test(passwordValue)) {
        setIsPassword(false);
      } else {
        setIsPassword(true);
      }
    },
    []
  );

  const onSocialSignInHandler = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.currentTarget as HTMLButtonElement;
      setIsLoading(true);

      try {
        if (target.name === 'google-signin') {
          const provider = new GoogleAuthProvider();
          await signInWithRedirect(isAuth, provider);
          return;
        }

        if (target.name === 'github-signin') {
          const provider = new GithubAuthProvider();
          await signInWithRedirect(isAuth, provider);
        }
      } catch (error) {
        const err = error as SystemError;
        return <Error statusCode={err.statusCode} title={err.message} />;
      }

      setIsLoading(false);
    },
    []
  );

  return (
    <BackgroundStyle customMessage='create????'>
      {isLoading && <LoadingMsg />}
      <>
        <LoginFormWrapper>
          <LoginForTitle>
            {signUp ? '*Sign Up /????????????' : '*Sign In /?????????'}
          </LoginForTitle>
          {isError && (
            <ErrorMsg>{'????????? ?????? ??????????????? ????????? ?????????'}.</ErrorMsg>
          )}
          <LoginForm onSubmit={onSubmitHandler}>
            {/* ID */}
            <label htmlFor='user-id'>*EMAIL /?????????</label>
            <StyledInput
              type='text'
              id='user-id'
              value={userEmail}
              onChange={onEmailChangeHandler}
              ref={inputRef}
            />
            <ValidationMsg isState={isEmail}>
              {!userEmail
                ? '???????????? ????????? ?????????.'
                : !isEmail
                ? '???????????? " @ " , " . " ??? ?????????????????????.'
                : null}
            </ValidationMsg>

            {/* PASSWORD */}
            <label htmlFor='user-password'>*PASSWORD /????????????</label>
            <StyledInput
              type='password'
              id='user-password'
              value={userPassword}
              onChange={onPasswordChangeHandler}
            />

            <ValidationMsg isState={isPassword}>
              {!userPassword
                ? '??????????????? ????????? ?????????.'
                : !isPassword
                ? '?????? + ????????? + ???????????? ???????????? 8?????? ?????? ???????????? ?????????.'
                : null}
            </ValidationMsg>
            <LoginBtn type='submit' disabled={isDisabled}>
              {'??????'}
            </LoginBtn>
          </LoginForm>
        </LoginFormWrapper>
        <SocialSignInWrapper>
          <SocialSignInIcon>
            <button name='github-signin' onClick={onSocialSignInHandler}>
              <BsGithub />
            </button>
          </SocialSignInIcon>
          <SocialSignInIcon>
            <button name='google-signin' onClick={onSocialSignInHandler}>
              <FcGoogle />
            </button>
          </SocialSignInIcon>
        </SocialSignInWrapper>
        <ToggleText onClick={onSignUpToggleHandler}>
          {signUp ? '?????????' : '????????????'}
        </ToggleText>
      </>
    </BackgroundStyle>
  );
};

export default withHeadMeta(LoginPage, '?????????');

const LoginFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoginForTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin-top: 1.5rem;
  margin-bottom: 3rem;

  ${({ theme }) => theme.device.desktop} {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    padding-left: 0;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 18rem;
  margin-bottom: 1.5rem;

  label {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.gray};
    margin-left: 0.5rem;
    margin-bottom: 0.4rem;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 1rem;
  font-weight: 700;
  border: none;
  margin-top: 0.2rem;

  &[type='password'] {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.orange};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.orange};
  }
`;

const ValidationMsg = styled.p<{ isState: boolean }>`
  visibility: ${({ isState }) => (isState ? 'hidden' : 'visible')};
  font-size: 0.7rem;
  color: ${({ theme, isState }) => (isState ? '#fff' : theme.colors.orange)};
  width: 100%;
  height: 1rem;
  padding-left: 0.2rem;
  margin-top: 0.4rem;
  margin-bottom: 1rem;
`;

const ErrorMsg = styled.p`
  font-size: 0.7rem;
  color: red;
  margin-bottom: 1rem;
`;

const LoginBtn = styled.button`
  font-size: 1rem;
  font-weight: 700;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.orange};
  border-radius: 1.4rem;
  margin-top: 1.5rem;

  &:active {
    color: ${({ theme }) => theme.colors.yellow};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray};
    color: ${({ theme }) => theme.colors.black};
  }
`;

const ToggleText = styled.p`
  font-size: 1rem;
  color: #fff;
  text-align: center;
  margin-top: 1.2rem;
  margin-bottom: 3.5rem;

  cursor: pointer;
`;

const SocialSignInWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SocialSignInIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.gray};

    &:hover,
    &:active {
      color: #fff;
      transition: color ease-in-out 100ms;
    }

    svg {
      color: #fff;
      font-size: 1.5rem;
      margin: 0 0.5rem;
    }
  }
`;

import { useState, useRef, useEffect } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import { auth } from '../../firebase/firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useRouter } from 'next/router';

import BackgroundStyle from '../../components/layout/BackgroundStyle';

const LoginPage: NextPage = () => {
  const route = useRouter();
  const [signUp, setSignUp] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // User EMAIL-PASSWORD Text
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  // Validation State
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const isDisabled = isEmail && isPassword ? false : true;

  useEffect(() => {
    inputRef.current!.focus();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        route.push('/');
        return;
      }
    });
  }, []);

  const getUser = async () => {
    if (signUp) {
      // Sign Up
      try {
        await createUserWithEmailAndPassword(auth, userEmail, userPassword);
      } catch (error) {
        setError(true);
      }
    } else {
      // Sign In
      try {
        await signInWithEmailAndPassword(auth, userEmail, userPassword);
      } catch (error) {
        setError(true);
      }
    }
  };

  const onSignUpToggleHandler = () => {
    setSignUp((prev) => !prev);
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    setUserEmail('');
    setUserPassword('');
  };

  const onEmailChangeHandler = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(target.value);

    const emailCheckRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const emailValue = target.value;

    if (!emailCheckRegex.test(emailValue)) {
      setIsEmail(false);
    } else {
      setIsEmail(true);
    }

    return;
  };

  const onPasswordChangeHandler = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setUserPassword(target.value);

    const passwordCheckRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    const passwordValue = target.value;

    if (!passwordCheckRegex.test(passwordValue)) {
      setIsPassword(false);
    } else {
      setIsPassword(true);
    }

    return;
  };

  return (
    <BackgroundStyle customMessage='create📝' backgroundColor='black'>
      <LoginFormWrapper>
        <LoginForTitle>
          {signUp ? '*Sign Up /회원가입' : '*Sign In /로그인'}
        </LoginForTitle>
        {error && <ErrorMsg>아이디 또는 비밀번호를 확인해 주세요.</ErrorMsg>}
        <LoginForm onSubmit={onSubmitHandler}>
          {/* ID */}
          <label htmlFor='user-id'>*EMAIL /이메일</label>
          <StyledInput
            type='text'
            id='user-id'
            value={userEmail}
            onChange={onEmailChangeHandler}
            ref={inputRef}
          />
          {!userEmail ? (
            <ValidationMsg isState={isEmail}>
              이메일을 입력해 주세요.
            </ValidationMsg>
          ) : !isEmail ? (
            <ValidationMsg isState={isEmail}>
              이메일은 " @ " , " . " 을 포함해야합니다.
            </ValidationMsg>
          ) : null}

          {/* PASSWORD */}
          <label htmlFor='user-password'>*PASSWORD /비밀번호</label>
          <StyledInput
            type='password'
            id='user-password'
            value={userPassword}
            onChange={onPasswordChangeHandler}
          />
          {!userPassword ? (
            <ValidationMsg isState={isPassword}>
              비밀번호를 입력해 주세요.
            </ValidationMsg>
          ) : !isPassword ? (
            <ValidationMsg isState={isPassword}>
              비밀번호는 숫자 + 영문자 + 특수문자 조합으로 8자리 이상 입력
              해주세요.
            </ValidationMsg>
          ) : null}
          <LoginBtn type='submit' disabled={isDisabled} onClick={getUser}>
            입력
          </LoginBtn>
        </LoginForm>

        <ToggleText onClick={onSignUpToggleHandler}>
          {signUp ? '로그인' : '회원가입'}
        </ToggleText>
      </LoginFormWrapper>
    </BackgroundStyle>
  );
};

export default LoginPage;

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
  margin-bottom: 1.5rem;

  ${({ theme }) => theme.device.desktop} {
    font-size: 1.5rem;
    margin-bottom: 3rem;
    padding-left: 0;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 90%;

  label {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.gray};
    margin-left: 0.5rem;
    margin-bottom: 0.4rem;
  }

  ${({ theme }) => theme.device.desktop} {
    width: 30%;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 1rem;
  margin-bottom: 0.8rem;
  font-weight: 700;

  &[type='password'] {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  &:focus {
    border: none;
    border-color: ${({ theme }) => theme.colors.orange};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.orange};
  }
`;

const ValidationMsg = styled.p<{ isState: boolean }>`
  font-size: 0.7rem;
  color: ${({ theme, isState }) => (isState ? '#fff' : theme.colors.orange)};
  margin-bottom: 1rem;
  padding-left: 0.2rem;
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
  margin-top: 0.5rem;
  margin-bottom: 2rem;

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.yellow};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray};
  }
`;

const ToggleText = styled.p`
  font-size: 0.8rem;
  color: #fff;
  text-align: center;

  cursor: pointer;

  &:hover,
  &:active {
    border-bottom: 0.1rem solid #fff;
  }
`;
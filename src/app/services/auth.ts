import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

const LOGIN = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user { _id username email }
    }
  }
`;

const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      _id username email
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private apollo: Apollo, private router: Router) {}

  login(username: string, password: string) {
    return this.apollo.query<any>({
      query: LOGIN,
      variables: { username, password }
    }).pipe(
      map(result => {
        const { token, user } = result.data.login;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('current_user', JSON.stringify(user));
        return user;
      })
    );
  }

  signup(username: string, email: string, password: string) {
    return this.apollo.mutate({
      mutation: SIGNUP,
      variables: { username, email, password }
    });
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getCurrentUser() {
    const u = localStorage.getItem('current_user');
    return u ? JSON.parse(u) : null;
  }
}
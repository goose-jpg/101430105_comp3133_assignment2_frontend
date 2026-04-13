import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const GET_ALL = gql`
  query { getAllEmployees {
    _id firstName lastName email gender
    designation department salary profilePicture
  }}
`;

const GET_ONE = gql`
  query GetEmployee($id: ID!) {
    searchEmployeeById(id: $id) {
      _id firstName lastName email gender
      designation department salary profilePicture
      createdAt updatedAt
    }
  }
`;

const ADD = gql`
  mutation Add(
    $firstName: String!, $lastName: String!, $email: String!,
    $gender: String!, $designation: String!, $department: String!,
    $salary: Float!, $profilePicture: String
  ) {
    addEmployee(
      firstName: $firstName, lastName: $lastName, email: $email,
      gender: $gender, designation: $designation, department: $department,
      salary: $salary, profilePicture: $profilePicture
    ) { _id }
  }
`;

const UPDATE = gql`
  mutation Update(
    $id: ID!, $firstName: String, $lastName: String, $email: String,
    $gender: String, $designation: String, $department: String, $salary: Float
  ) {
    updateEmployee(
      id: $id, firstName: $firstName, lastName: $lastName, email: $email,
      gender: $gender, designation: $designation, department: $department,
      salary: $salary
    ) { _id }
  }
`;

const DELETE = gql`
  mutation Delete($id: ID!) { deleteEmployee(id: $id) }
`;

const SEARCH = gql`
  query Search($department: String, $position: String) {
    searchEmployeeByDepartmentOrPosition(
      department: $department, position: $position
    ) {
      _id firstName lastName email designation department salary
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAll()           { return this.apollo.watchQuery<any>({ query: GET_ALL }); }
  getOne(id: string) { return this.apollo.watchQuery<any>({ query: GET_ONE, variables: { id } }); }

  add(vars: any) {
    return this.apollo.mutate({ mutation: ADD, variables: vars,
      refetchQueries: [{ query: GET_ALL }] });
  }
  update(vars: any) {
    return this.apollo.mutate({ mutation: UPDATE, variables: vars,
      refetchQueries: [{ query: GET_ALL }] });
  }
  delete(id: string) {
    return this.apollo.mutate({ mutation: DELETE, variables: { id },
      refetchQueries: [{ query: GET_ALL }] });
  }
  search(department?: string, position?: string) {
    return this.apollo.watchQuery<any>({
      query: SEARCH, variables: { department, position }
    });
  }
}
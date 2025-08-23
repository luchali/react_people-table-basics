import React, { useEffect, useState } from 'react';
import { Loader } from '../Loader/Loader';
import { getPeople } from '../../api';
import { Person } from '../../types';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { PersonLink } from '../PersonLink';

export const PeoplePage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [people, setPeople] = useState<Person[]>();
  const [errorMessage, setErrorMessage] = useState('');
  const { slug } = useParams();

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage('');

    getPeople()
      .then((res: Person[]) => {
        setPeople(res);
        setIsLoading(false);
        if (res.length === 0) {
          setErrorMessage('There are no people on the server');
        }
      })
      .catch(() => {
        setErrorMessage('Something went wrong');
        setIsLoading(false);
      });
  }, []);

  const peopleExist = people !== undefined && people.length !== 0;

  return (
    <>
      <h1 className="title">People Page</h1>
      <div className="block">
        <div className="box table-container">
          {isLoading && <Loader />}
          {errorMessage && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>
          )}
          {!isLoading && errorMessage && !peopleExist && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}

          {peopleExist && (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>

              <tbody>
                {people?.map(person => {
                  const motherExist = people.find(
                    pers => pers.name === person.motherName,
                  );
                  const fatherExist = people.find(
                    pers => pers.name === person.fatherName,
                  );

                  return (
                    <tr
                      data-cy="person"
                      key={person.slug}
                      className={classNames({
                        'has-background-warning': person.slug === slug,
                      })}
                    >
                      <td>
                        <PersonLink person={person} />
                      </td>

                      <td>
                        <a href="">{person.sex}</a>
                      </td>
                      <td>{person.born}</td>
                      <td>{person.died}</td>
                      <td>
                        {person.motherName ? (
                          motherExist ? (
                            <PersonLink person={motherExist} />
                          ) : (
                            person.motherName
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {person.fatherName ? (
                          fatherExist ? (
                            <PersonLink person={fatherExist} />
                          ) : (
                            person.fatherName
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

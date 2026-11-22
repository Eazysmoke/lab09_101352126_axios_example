import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Button, Card, Modal } from 'react-bootstrap';

const apiUrl = 'https://randomuser.me/api/?results=10';

function ProfileFields({ person }) {
  const { location, login, gender, email, dob, registered, phone, cell } = person;
  const address = [
    location.street.number + ' ' + location.street.name,
    location.city,
    location.state,
    location.country + ' ' + location.postcode,
  ].join(', ');

  const fields = [
    ['User Name', login.username],
    ['Gender', gender.toUpperCase()],
    ['Time Zone Description', location.timezone.description],
    ['Address', address],
    ['Email', email],
    ['Birth Date and Age', dob.date.slice(0, 10) + ' (' + dob.age + ')'],
    ['Register Date', registered.date.slice(0, 10)],
    ['Phone #', phone],
    ['Cell #', cell],
  ];

  return (
    <dl className="profile-fields mb-0">
      {fields.map(([label, value]) => (
        <React.Fragment key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

function fullName({ name }) {
  return [name.title, name.first, name.last].join(' ');
}

export default function PersonList() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPersons() {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get(apiUrl, {
          signal: controller.signal,
          timeout: 15000,
        });
        if (!Array.isArray(response.data.results)) {
          throw new Error('Invalid user response');
        }
        setPersons(response.data.results);
      } catch {
        if (!controller.signal.aborted) {
          setError('Unable to load users. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPersons();
    return () => controller.abort();
  }, [attempt]);

  if (loading) return <p role="status">Loading users…</p>;

  if (error) {
    return (
      <Alert variant="danger">
        <p>{error}</p>
        <Button onClick={() => setAttempt(attempt + 1)}>Try again</Button>
      </Alert>
    );
  }

  if (!persons.length) return <p>No users found.</p>;

  return (
    <>
      {persons.map((person) => (
        <Card key={person.login.uuid} className="profile-card mb-3">
          <Card.Header as="h2" className="h6 mb-0">
            {fullName(person)} <span className="profile-id">– {person.login.uuid}</span>
          </Card.Header>
          <Card.Body className="profile-body">
            <div className="profile-photo">
              <img src={person.picture.large} alt={fullName(person)} width="128" height="128" />
              <Button size="sm" onClick={() => setSelected(person)}>Details</Button>
            </div>
            <ProfileFields person={person} />
          </Card.Body>
        </Card>
      ))}
      <Modal show={selected !== null} onHide={() => setSelected(null)} centered aria-labelledby="profile-title">
        {selected && (
          <>
            <Modal.Header closeButton>
              <Modal.Title id="profile-title">{fullName(selected)}</Modal.Title>
            </Modal.Header>
            <Modal.Body><ProfileFields person={selected} /></Modal.Body>
          </>
        )}
      </Modal>
    </>
  );
}

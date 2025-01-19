import React, { useEffect, useState, ChangeEvent } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { User } from './types';

const FetchUserData: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const [nameFilter, setNameFilter] = useState<string>('');
	const [cityFilter, setCityFilter] = useState<string>('');
	const [highlightOldest, setHighlightOldest] = useState<boolean>(false);

	useEffect(() => {
		const fetchUsers = async () => {
			const response = await fetch(
				'https://dummyjson.com/users?limit=1000'
			);
			const data = await response.json();
			console.log(data.users);
			setUsers(data.users);
			setFilteredUsers(data.users);
		};
		fetchUsers();
	}, []);

	useEffect(() => {
		const timeout = setTimeout(() => {
			const filtered = users.filter((user) =>
				`${user.firstName} ${user.lastName}`
					.toLowerCase()
					.includes(nameFilter.toLowerCase())
			);
			setFilteredUsers(filtered);
		}, 1000);

		return () => clearTimeout(timeout);
	}, [nameFilter, users]);

	useEffect(() => {
		const filtered = users.filter((user) =>
			cityFilter ? user.address.city === cityFilter : true
		);
		setFilteredUsers(filtered);
	}, [cityFilter, users]);

	const getOldestUsersByCity = () => {
		const cityGroups: { [key: string]: User[] } = {};
		users.forEach((user) => {
			const cityKey = user.address.city || 'Unknown';
			if (!cityGroups[cityKey]) cityGroups[cityKey] = [];
			cityGroups[cityKey].push(user);
		});

		const oldestUsers: number[] = [];
		for (const city in cityGroups) {
			const oldest = cityGroups[city].reduce((prev, curr) =>
				new Date(prev.birthDate) < new Date(curr.birthDate)
					? prev
					: curr
			);
			oldestUsers.push(oldest.id);
		}
		return oldestUsers;
	};

	const oldestUserIds = highlightOldest ? getOldestUsersByCity() : [];

	return (
		<div className="container mt-4 ">
			<div className="row mb-3">
				<div className="col-md-4">
					<h4 className="fs-6 text-start mt-2">Name</h4>
					<input
						type="text"
						className="form-control border"
						placeholder="Search by name"
						value={nameFilter}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setNameFilter(e.target.value)
						}
					/>
				</div>
				<div className="col-md-4">
					<h4 className="fs-6 text-start mt-2">City</h4>
					<select
						className="form-select"
						value={cityFilter}
						onChange={(e: ChangeEvent<HTMLSelectElement>) =>
							setCityFilter(e.target.value)
						}
					>
						<option value="">Select city</option>
						{[
							...new Set(
								users.map(
									(user) => user.address.city || 'Unknown'
								)
							),
						].map((city) => (
							<option key={city} value={city}>
								{city}
							</option>
						))}
					</select>
				</div>
				<div className="col-md-4 d-flex align-items-center mt-4">
					<div className="form-check mt-2">
						<input
							type="checkbox"
							className="form-check-input"
							id="highlightOldest"
							checked={highlightOldest}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setHighlightOldest(e.target.checked)
							}
						/>
						<p className="form-check-label">
							Highlight oldest per city
						</p>
					</div>
				</div>
			</div>
			<table className="table table-bordered table-hover ">
				<thead className="table-light">
					<tr>
						<th>Name</th>
						<th>City</th>
						<th>Birthday</th>
					</tr>
				</thead>
				<tbody>
					{filteredUsers.map((user) => (
						<tr
							key={user.id}
							className={
								oldestUserIds.includes(user.id)
									? 'table-primary'
									: ''
							}
						>
							<td>{`${user.firstName} ${user.lastName}`}</td>
							<td>{user.address.city || 'Unknown'}</td>
							<td>
								{new Date(user.birthDate).toLocaleDateString()}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default FetchUserData;

// this is leaderboard table for the parent dashboard

import React from "react";
import '../css/ParentHub.css';

export default function Leaderboard(props) {
    const { children } = props
    return (
        <>
            {children ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Child</th>
                            <th>Total XP</th>
                            <th>Current Language</th>
                        </tr>
                    </thead>
                    <tbody>
                        {children.map((child, index) => (
                            <tr key={index}>
                                <td>{child.name}</td>
                                <td>{child.xp}</td>
                                <td>{child.currentLanguage}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading...</p>
            )}
        </>
    )
}
import React from "react";
import '../css/ParentHub.css';

/**
 * Leaderboard Component
 * 
 * The `Leaderboard` component displays a table of children, showing each child's name, total XP, and current programming language.
 * This component is typically used in the parent dashboard to track the progress of multiple children.
 * 
 * Props:
 * - children: An array of child objects, where each object contains the name, XP, and current programming language of a child.
 * 
 * Structure:
 * - The component conditionally renders either a loading message or the leaderboard table based on the presence of child data.
 */

export default function Leaderboard(props) {
    const { children } = props;

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
    );
}

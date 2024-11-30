// src/components/Node.js

import React from 'react'
import './Node.css'

const Node = ({ value, onClick, isStart, isFinish }) => {
	return (
		<div
			className={`node ${isStart ? 'start' : ''} ${isFinish ? 'finish' : ''}`}
			onClick={() => onClick(value)}
		>
			{value}
		</div>
	)
}

export default Node

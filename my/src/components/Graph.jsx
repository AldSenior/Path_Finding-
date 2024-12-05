import React, { useState } from 'react'
import './Graph.css'
import Node from './Node' // Импорт компонента узла

const Graph = () => {
	const [nodes, setNodes] = useState([])
	const [edges, setEdges] = useState({})
	const [startNode, setStartNode] = useState(null)
	const [finishNode, setFinishNode] = useState(null)
	const [shortestPath, setShortestPath] = useState([])

	const addNode = (nodeValue) => {
		if (nodeValue && !nodes.includes(nodeValue)) {
			setNodes((prev) => [...prev, nodeValue])
			setEdges((prev) => ({ ...prev, [nodeValue]: [] }))
		} else {
			alert("Узел с таким названием уже существует или введено пустое значение!")
		}
	}

	const addEdge = (from, to) => {
		if (from && to && from !== to) {
			if (!edges[from].includes(to) && !edges[to].includes(from)) {
				setEdges((prevEdges) => ({
					...prevEdges,
					[from]: [...prevEdges[from], to],
				}))
			}
		} else {
			alert('Укажите корректные узлы')
		}
	}

	const findShortestPath = () => {
		if (!startNode || !finishNode) {
			alert('Укажите начальный и конечный узел!')
			return
		}

		const queue = [[startNode]]
		const visited = new Set()

		while (queue.length) {
			const path = queue.shift()
			const node = path[path.length - 1]

			if (!visited.has(node)) {
				visited.add(node)
				for (const neighbor of edges[node] || []) {
					const newPath = [...path, neighbor]
					if (neighbor === finishNode) {
						setShortestPath(newPath)
						return
					}
					queue.push(newPath)
				}
			}
		}

		alert('Путь не найден')
		setShortestPath([])
	}

	const resetGraph = () => {
		setNodes([])
		setEdges({})
		setStartNode(null)
		setFinishNode(null)
		setShortestPath([])
	}

	const getNodePosition = (index) => {
		const angle = (index / nodes.length) * Math.PI * 2 // Угол для узла
		const radius = 200 // Радиус круга
		const x = Math.cos(angle) * radius + 250 // Центрируем по X
		const y = Math.sin(angle) * radius + 250 // Центрируем по Y
		return { x, y }
	}

	return (
		<div className="graph-container">
			<h2>Граф и поиск кратчайшего пути</h2>
			<div className="nodes">
				{nodes.map((node) => (
					<Node
						key={node}
						value={node}
						onClick={(value) => {
							if (!startNode) {
								setStartNode(value)
							} else if (!finishNode) {
								setFinishNode(value)
							} else {
								alert('Начальная и конечная вершины уже выбраны')
							}
						}}
						isStart={node === startNode}
						isFinish={node === finishNode}
					/>
				))}
			</div>
			<div className="buttons">
				<button onClick={() => addNode(prompt('Введите название узла:'))}>

					Добавить узел
				</button>
				<button
					onClick={() => {
						const from = prompt('Введите начальный узел:')
						const to = prompt('Введите конечный узел:')
						if (nodes.includes(from) && nodes.includes(to)) {
							addEdge(from, to)
						} else {
							alert('Укажите корректные узлы')
						}
					}}
				>
					Добавить ребро
				</button>
				<button onClick={findShortestPath}>Найти кратчайший путь</button>
				<button onClick={resetGraph}>Сбросить граф</button>
			</div>
			{/* Вывод кратчайшего пути */}
			{shortestPath.length > 0 && (
				<div className="shortest-path">
					<h3>Кратчайший путь:</h3>
					<p>{shortestPath.join(' -> ')}</p>
				</div>
			)}
			<div className='screenGraph'>
				<svg style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
					{/* Отображение узлов */}
					{nodes.map((node, index) => {
						const position = getNodePosition(index)
						return (
							<Node
								key={node}
								value={node}
								x={position.x}
								y={position.y}
								onClick={(value) => {
									if (!startNode) {
										setStartNode(value)
									} else if (!finishNode) {
										setFinishNode(value)
									} else {
										alert('Начальная и конечная вершины уже выбраны')
									}
								}}
								isStart={node === startNode}
								isFinish={node === finishNode}
							/>
						)
					})}

					{/* Отображение рёбер и подписей */}
					{Object.entries(edges).flatMap(([node, neighbors]) =>
						neighbors.map((neighbor) => {
							const fromPos = getNodePosition(nodes.indexOf(node))
							const toPos = getNodePosition(nodes.indexOf(neighbor))
							const midX = (fromPos.x + toPos.x) / 2
							const midY = (fromPos.y + toPos.y) / 2

							return (
								<g key={`${node}-${neighbor}`}>
									<line
										x1={fromPos.x}
										y1={fromPos.y}
										x2={toPos.x}
										y2={toPos.y}
										stroke="gray"
										strokeWidth="2"
									/>
									{/* Текст рёбер в середине линии */}
									<text
										x={midX}
										y={midY - 10}
										fill="black"
										fontSize="12"
										textAnchor="middle"
									>
										{node} - {neighbor}
									</text>
								</g>
							)
						})
					)}

					{nodes.map((node, index) => {
						const position = getNodePosition(index)
						return (
							<g key={node}>
								<circle cx={position.x} cy={position.y} r={15} fill="blue" />
								<text
									x={position.x}
									y={position.y + 25}
									fill="black"
									fontSize="12"
									textAnchor="middle"
								>
									{node}
								</text>
							</g>
						)
					})}

					{/* Отображение кратчайшего пути */}
					{shortestPath.length > 0 && (
						<g>
							{shortestPath.map((node, index) => {
								const position = getNodePosition(nodes.indexOf(node))
								const nextNode = shortestPath[index + 1]

								if (nextNode) {
									const nextPosition = getNodePosition(nodes.indexOf(nextNode))
									return (
										<line
											key={`${node}-${nextNode}`}
											x1={position.x}
											y1={position.y}
											x2={nextPosition.x}
											y2={nextPosition.y}
											stroke="red"
											strokeWidth="4"
										/>
									)
								}
								return null
							})}
						</g>
					)}
				</svg>
			</div>


		</div>
	)
}

export default Graph

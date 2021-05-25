# # A Python3 program to check if there is a cycle in  
# # directed graph using BFS. 
# import math
# import sys
# from collections import defaultdict
 
# # Class to represent a graph 
# class Graph:
#     def __init__(self,vertices):
#         self.graph=defaultdict(list)
#         self.V=vertices # No. of vertices' 
     
#     # function to add an edge to graph
#     def addEdge(self,u,v):
#         self.graph[u].append(v)
 
# # This function returns true if there is a cycle 
# # in directed graph, else returns false. 
# def isCycleExist(n,graph):
 
#     # Create a vector to store indegrees of all 
#     # vertices. Initialize all indegrees as 0. 
#     in_degree=[0]*n
 
#     # Traverse adjacency lists to fill indegrees of 
#     # vertices. This step takes O(V+E) time
#     for i in range(n):
#         for j in graph[i]:
#             in_degree[j]+=1
     
#     # Create an queue and enqueue all vertices with 
#     # indegree 0
#     queue=[]
#     for i in range(len(in_degree)):
#         if in_degree[i]==0:
#             queue.append(i)
     
#     # Initialize count of visited vertices
#     cnt=0
 
#     # One by one dequeue vertices from queue and enqueue 
#     # adjacents if indegree of adjacent becomes 0 
#     while(queue):
 
#         # Extract front of queue (or perform dequeue) 
#         # and add it to topological order 
#         nu=queue.pop(0)
 
#         # Iterate through all its neighbouring nodes 
#         # of dequeued node u and decrease their in-degree 
#         # by 1 
#         for v in graph[nu]:
#             in_degree[v]-=1
 
#             # If in-degree becomes zero, add it to queue
#             if in_degree[v]==0:
#                 queue.append(v)
#         cnt+=1
 
#     # Check if there was a cycle 
#     if cnt==n:
#         return False
#     else:
#         return True


#  g=Graph(6)
#     g.addEdge(0,1)
#     g.addEdge(1,2)
#     g.addEdge(2,0)
#     g.addEdge(3,4)
#     g.addEdge(4,5)
     
#     if isCycleExist(g.V,g.graph):
#         print("Yes")
#     else:
#         print("No")
         
# # Python program to detect cycle 
# # in a graph 

from collections import defaultdict 

class Graph(): 
	def __init__(self,vertices): 
		self.graph = defaultdict(list) 
		self.V = vertices + 1

	def addEdge(self,u,v): 
		self.graph[u].append(v) 

	def isCyclicUtil(self, v, visited, recStack): 

		# Mark current node as visited and 
		# adds to recursion stack 
		visited[v] = True
		recStack[v] = True

		# Recur for all neighbours 
		# if any neighbour is visited and in 
		# recStack then graph is cyclic 
		for neighbour in self.graph[v]: 

			if visited[neighbour] == False: 
				if self.isCyclicUtil(neighbour, visited, recStack) == True: 
					return True
			elif recStack[neighbour] == True: 
				return True

		# The node needs to be poped from 
		# recursion stack before function ends 
		recStack[v] = False
		return False

	# Returns true if graph is cyclic else false 
	def isCyclic(self): 
		visited = [False] * self.V 
		recStack = [False] * self.V 
		for node in range(self.V): 
			if visited[node] == False: 
				if self.isCyclicUtil(node,visited,recStack) == True: 
					return True
		return False

# g = Graph(2) 
# g.addEdge(1, 2) 
# g.addEdge(2, 1) 
# # g.addEdge(3, 1) 

# if g.isCyclic() == 1: 
# 	print("Graph has a cycle")
# else: 
# 	print("Graph has no cycle")

# Thanks to Divyanshu Mehta for contributing this code 

# class Graph:
#     def __init__(self, v):
#         # No. of vertices of graph
#         self.v = v
#         # Adjacency List
#         self.adj = [0] * v
#         for i in range(self.v):
#             self.adj[i] = []

#     def addEdge(self, i,j):
#         self.adj[i].append(j)

#     def isCyclic(self):
#         visited = [False] * self.v
#         helper = [False] * self.v
#         for i in range(self.v):
#             if visited[i] == False:
#                 ans = self.DFS(i,visited,helper)
#                 if ans == True:
#                     return True
#         return False


#     def DFS(self,i, visited,helper):
#         visited[i] = True
#         helper[i] = True
#         neighbours = self.adj[i]
#         for k in range(len(neighbours)):
#             curr = neighbours[k]
#             if helper[curr] == True:
#                 return True
#             if visited[curr] == False:
#                 ans = self.DFS(curr,visited,helper)
#                 if ans == True:
#                     return True
#         helper[i] = False
#         return False


# https://www.algotree.org/algorithms/tree_graph_traversal/depth_first_search/cycle_detection_in_directed_graphs/

# class Graph:

#     def __init__(self, adjlist, nodes):

#         self.adjlist = adjlist
#         self.nodes = nodes
#         self.visited = [False] * nodes
#         # inpath stores the visited nodes in the traversal path
#         # for finding cycle in a directed graph.
#         self.inpath = [False] * nodes
#         self.cycle_present = False

#     def AddEdge (self, src, dst, bidirectional):

#         if src not in self.adjlist :
#             self.adjlist[src] = []

#         if dst not in self.adjlist :
#             self.adjlist[dst] = []

#         self.adjlist[src].append(dst)
#         if bidirectional: # Check if the edge is undirected (bidirectional)
#             self.adjlist[dst].append(src)

#     # Function detects cycle in a directed graph
#     def DFS_DetectCycleInDirectedGraph (self, src):

#         self.visited[src] = True

#         # Set the flag for the vertex visited in traversal path
#         self.inpath[src] = True

#         for adj_node in self.adjlist[src]:

#             if self.inpath[adj_node] == True:
#                 self.cycle_present = True
#                 return
#             elif self.visited[adj_node] == False:
#                 self.DFS_DetectCycleInDirectedGraph (adj_node)

#         # Before we backtrack unset the flag for the src vertex as it
#         # might be in the next traversal path
#         self.inpath[src] = False

#     # Mark nodes unvisited for the next traversal
#     def MarkUnvisited (self):
#         self.visited = [False] * nodes

#     def IsCyclePresent (self):
#         return self.cycle_present

# # # A Python3 program to check if there is a cycle in  
# # # directed graph using BFS. 
# # import math
# # import sys
# # from collections import defaultdict
 
# # # Class to represent a graph 
# # class Graph:
# #     def __init__(self,vertices):
# #         self.graph=defaultdict(list)
# #         self.V=vertices # No. of vertices' 
     
# #     # function to add an edge to graph
# #     def addEdge(self,u,v):
# #         self.graph[u].append(v)
 
# # # This function returns true if there is a cycle 
# # # in directed graph, else returns false. 
# # def isCycleExist(n,graph):
 
# #     # Create a vector to store indegrees of all 
# #     # vertices. Initialize all indegrees as 0. 
# #     in_degree=[0]*n
 
# #     # Traverse adjacency lists to fill indegrees of 
# #     # vertices. This step takes O(V+E) time
# #     for i in range(n):
# #         for j in graph[i]:
# #             in_degree[j]+=1
     
# #     # Create an queue and enqueue all vertices with 
# #     # indegree 0
# #     queue=[]
# #     for i in range(len(in_degree)):
# #         if in_degree[i]==0:
# #             queue.append(i)
     
# #     # Initialize count of visited vertices
# #     cnt=0
 
# #     # One by one dequeue vertices from queue and enqueue 
# #     # adjacents if indegree of adjacent becomes 0 
# #     while(queue):
 
# #         # Extract front of queue (or perform dequeue) 
# #         # and add it to topological order 
# #         nu=queue.pop(0)
 
# #         # Iterate through all its neighbouring nodes 
# #         # of dequeued node u and decrease their in-degree 
# #         # by 1 
# #         for v in graph[nu]:
# #             in_degree[v]-=1
 
# #             # If in-degree becomes zero, add it to queue
# #             if in_degree[v]==0:
# #                 queue.append(v)
# #         cnt+=1
 
# #     # Check if there was a cycle 
# #     if cnt==n:
# #         return False
# #     else:
# #         return True


# #  g=Graph(6)
# #     g.addEdge(0,1)
# #     g.addEdge(1,2)
# #     g.addEdge(2,0)
# #     g.addEdge(3,4)
# #     g.addEdge(4,5)
     
# #     if isCycleExist(g.V,g.graph):
# #         print("Yes")
# #     else:
# #         print("No")
         
# # # Python program to detect cycle 
# # # in a graph 

# from collections import defaultdict 

# class Graph(): 
# 	def __init__(self,vertices): 
# 		self.graph = defaultdict(list) 
# 		self.V = vertices 

# 	def addEdge(self,u,v): 
# 		self.graph[u].append(v) 

# 	def isCyclicUtil(self, v, visited, recStack): 

# 		# Mark current node as visited and 
# 		# adds to recursion stack 
# 		visited[v] = True
# 		recStack[v] = True

# 		# Recur for all neighbours 
# 		# if any neighbour is visited and in 
# 		# recStack then graph is cyclic 
# 		for neighbour in self.graph[v]: 
# 			print('graph: ', self.graph, 'v: ', v, 'neighbour: ',neighbour)
# 			if visited[neighbour] == False: 
# 				if self.isCyclicUtil(neighbour, visited, recStack) == True: 
# 					return True
# 			elif recStack[neighbour] == True: 
# 				return True

# 		# The node needs to be poped from 
# 		# recursion stack before function ends 
# 		recStack[v] = False
# 		return False

# 	# Returns true if graph is cyclic else false 
# 	def isCyclic(self): 
# 		visited = [False] * self.V 
# 		recStack = [False] * self.V 
# 		for node in range(self.V): 
# 			if visited[node] == False: 
# 				if self.isCyclicUtil(node,visited,recStack) == True: 
# 					return True
# 		return False

# # g = Graph(4) 
# # g.addEdge(0, 1) 
# # g.addEdge(0, 2) 
# # g.addEdge(1, 2) 
# # g.addEdge(2, 0) 
# # g.addEdge(2, 3) 
# # g.addEdge(3, 3) 
# # if g.isCyclic() == 1: 
# # 	print("Graph has a cycle")
# # else: 
# # 	print("Graph has no cycle")

# # Thanks to Divyanshu Mehta for contributing this code 

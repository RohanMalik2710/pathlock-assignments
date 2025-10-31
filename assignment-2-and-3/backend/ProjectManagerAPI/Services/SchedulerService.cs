using System;
using System.Collections.Generic;
using System.Linq;

namespace ProjectManagerAPI.Services
{
    public class SchedulerService
    {
        // DTO representing a single task input for scheduling
        public class SchedulerInputTask
        {
            public string Title { get; set; } = string.Empty;
            public int? EstimatedHours { get; set; }
            public DateTime? DueDate { get; set; }
            public List<string>? Dependencies { get; set; }
        }

        /// <summary>
        /// Recommends the optimal order of tasks based on due dates and dependencies.
        /// If dependencies are provided, performs a topological sort with a due date tiebreaker.
        /// Otherwise, simply sorts by due date (earliest first).
        /// </summary>
        public List<string> RecommendOrderByDueDateAndDependencies(List<SchedulerInputTask> tasks)
        {
            if (tasks == null || tasks.Count == 0)
                return new List<string>();

            // Check if any task has dependencies
            bool hasDependencies = tasks.Any(t => t.Dependencies != null && t.Dependencies.Count > 0);
            if (!hasDependencies)
            {
                // Sort by due date and estimated hours when no dependencies exist
                return tasks
                    .OrderBy(t => t.DueDate ?? DateTime.MaxValue)
                    .ThenBy(t => t.EstimatedHours ?? int.MaxValue)
                    .Select(t => t.Title)
                    .ToList();
            }

            // Build dependency graph (title → successors)
            var titleMap = tasks.ToDictionary(t => t.Title, t => t);
            var graph = new Dictionary<string, List<string>>();
            var indegree = new Dictionary<string, int>();

            foreach (var task in tasks)
            {
                graph[task.Title] = new List<string>();
                indegree[task.Title] = 0;
            }

            foreach (var task in tasks)
            {
                if (task.Dependencies == null) continue;

                foreach (var dep in task.Dependencies)
                {
                    if (!titleMap.ContainsKey(dep))
                        continue; // ignore missing dependencies

                    graph[dep].Add(task.Title);
                    indegree[task.Title]++;
                }
            }

            // ✅ Priority queue (SortedSet) — earliest due date first, then alphabetical
            var pq = new SortedSet<(DateTime, string)>(Comparer<(DateTime, string)>.Create((a, b) =>
            {
                int cmp = a.Item1.CompareTo(b.Item1); // compare by due date
                if (cmp == 0)
                    return string.Compare(a.Item2, b.Item2, StringComparison.Ordinal); // then by title
                return cmp;
            }));

            // Initialize PQ with tasks having no dependencies
            foreach (var kv in indegree.Where(kv => kv.Value == 0))
            {
                var title = kv.Key;
                var dueDate = titleMap[title].DueDate ?? DateTime.MaxValue;
                pq.Add((dueDate, title));
            }

            var result = new List<string>();

            // Process PQ
            while (pq.Any())
            {
                var current = pq.Min;
                pq.Remove(current);
                var currentTitle = current.Item2;

                result.Add(currentTitle);

                foreach (var neighbor in graph[currentTitle])
                {
                    indegree[neighbor]--;
                    if (indegree[neighbor] == 0)
                    {
                        var ndueDate = titleMap[neighbor].DueDate ?? DateTime.MaxValue;
                        pq.Add((ndueDate, neighbor));
                    }
                }
            }

            // 🌀 Cycle fallback — if not all tasks included, fallback to due-date sort
            if (result.Count != tasks.Count)
            {
                return tasks
                    .OrderBy(t => t.DueDate ?? DateTime.MaxValue)
                    .Select(t => t.Title)
                    .ToList();
            }

            return result;
        }
    }
}

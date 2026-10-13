import Job from '../models/jobModel.js';
import { DSAQuestion } from '../models/dsaModel.js';
import { AptitudeQuestion } from '../models/aptitudeModel.js';

export const seedSampleData = async () => {
  try {
    // 1. Seed Sample Jobs
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      await Job.insertMany([
        {
          title: 'Associate Software Engineer (SDE-1)',
          company: 'Infosys / ThoughtWorks Drive',
          location: 'Bengaluru / Hyderabad (Hybrid)',
          requiredSkills: ['Java', 'Spring Boot', 'SQL', 'Data Structures', 'REST APIs'],
          experienceLevel: 'Fresher (2025/2026 Batch)',
          description:
            'Exciting opportunity for graduate engineers to work on modern distributed enterprise applications, cloud native APIs, and automated test pipelines.',
          applicationUrl: 'https://careers.example.com/apply/sde-1',
          source: 'Sample Campus Placement Drive',
          isSampleData: true,
        },
        {
          title: 'Graduate Frontend Developer',
          company: 'Razorpay / Fintech Labs',
          location: 'Bengaluru / Remote',
          requiredSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux'],
          experienceLevel: 'Entry-Level (0-1 yrs)',
          description:
            'Build responsive, accessible user interfaces for payment processing web applications with modern React workflows.',
          applicationUrl: 'https://careers.example.com/apply/frontend-grad',
          source: 'Sample Campus Placement Drive',
          isSampleData: true,
        },
        {
          title: 'Full Stack Web Developer Intern / Trainee',
          company: 'Cognizant Digital',
          location: 'Pune / Chennai',
          requiredSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'],
          experienceLevel: 'Fresher (0 yrs)',
          description:
            'Join our agile digital product team building full stack MERN web applications with MongoDB and REST APIs.',
          applicationUrl: 'https://careers.example.com/apply/mern-trainee',
          source: 'Sample Campus Placement Drive',
          isSampleData: true,
        },
        {
          title: 'Cloud & DevOps Associate Engineer',
          company: 'Wipro Cloud Solutions',
          location: 'Noida / Gurgaon',
          requiredSkills: ['Linux', 'Python', 'Docker', 'Git', 'AWS', 'Networking'],
          experienceLevel: 'Fresher (2026 Batch)',
          description:
            'Automate infrastructure provisioning, CI/CD pipelines, containerized deployments, and server monitoring.',
          applicationUrl: 'https://careers.example.com/apply/devops-associate',
          source: 'Sample Campus Placement Drive',
          isSampleData: true,
        },
      ]);
      console.log('[Seed] Sample job listings seeded successfully.');
    }

    // 2. Seed All 11 Algorithmic Topics for DSA
    const dsaCount = await DSAQuestion.countDocuments();
    if (dsaCount === 0) {
      await DSAQuestion.insertMany([
        {
          title: 'Two Sum',
          topic: 'Arrays',
          difficulty: 'Easy',
          description:
            'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
          examples: [
            {
              input: 'nums = [2,7,11,15], target = 9',
              output: '[0,1]',
              explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
            },
          ],
          constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
          hints: ['Use a Hash Map to store complement values in O(N) time.'],
        },
        {
          title: 'Valid Palindrome',
          topic: 'Strings',
          difficulty: 'Easy',
          description:
            'A phrase is a palindrome if, after converting uppercase letters into lowercase and removing non-alphanumeric characters, it reads the same forward and backward.',
          examples: [
            {
              input: 's = "A man, a plan, a canal: Panama"',
              output: 'true',
              explanation: '"amanaplanacanalpanama" is a palindrome.',
            },
          ],
          constraints: ['1 <= s.length <= 2 * 10^5'],
          hints: ['Use two pointers moving inward from opposite ends.'],
        },
        {
          title: 'Reverse Linked List',
          topic: 'Linked Lists',
          difficulty: 'Easy',
          description: 'Given the head of a singly linked list, reverse the list and return the reversed list.',
          examples: [
            {
              input: 'head = [1,2,3,4,5]',
              output: '[5,4,3,2,1]',
              explanation: 'The linked list order is reversed.',
            },
          ],
          constraints: ['0 <= Number of nodes <= 5000'],
          hints: ['Maintain prev, curr, and next pointers during in-place traversal.'],
        },
        {
          title: 'Valid Parentheses',
          topic: 'Stacks',
          difficulty: 'Easy',
          description:
            'Given a string s containing characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
          examples: [
            {
              input: 's = "()[]{}"',
              output: 'true',
              explanation: 'All opened brackets are closed in valid sequence.',
            },
          ],
          constraints: ['1 <= s.length <= 10^4'],
          hints: ['Push opening brackets onto stack, pop and verify on matching closing brackets.'],
        },
        {
          title: 'Implement Queue using Stacks',
          topic: 'Queues',
          difficulty: 'Easy',
          description: 'Implement a first-in first-out (FIFO) queue using only two standard stacks.',
          examples: [
            {
              input: '["MyQueue", "push", "push", "peek", "pop", "empty"]\n[[], [1], [2], [], [], []]',
              output: '[null, null, null, 1, 1, false]',
              explanation: 'Elements are enqueued and dequeued in FIFO order.',
            },
          ],
          constraints: ['At most 100 calls will be made to push, pop, peek, and empty.'],
          hints: ['Use an input stack for push, and transfer to output stack on pop/peek.'],
        },
        {
          title: 'Binary Tree Level Order Traversal',
          topic: 'Trees',
          difficulty: 'Medium',
          description:
            'Given the root of a binary tree, return the level order traversal of its nodes values (left to right, level by level).',
          examples: [
            {
              input: 'root = [3,9,20,null,null,15,7]',
              output: '[[3],[9,20],[15,7]]',
              explanation: 'Nodes grouped by level depth.',
            },
          ],
          constraints: ['0 <= Number of nodes <= 2000'],
          hints: ['Use Breadth-First Search (BFS) with a queue counting queue size per level.'],
        },
        {
          title: 'Number of Islands',
          topic: 'Graphs',
          difficulty: 'Medium',
          description:
            'Given an m x n 2D binary grid grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.',
          examples: [
            {
              input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]',
              output: '2',
              explanation: 'Two distinct connected components of land exist.',
            },
          ],
          constraints: ['m == grid.length, n == grid[i].length', '1 <= m, n <= 300'],
          hints: ['Use DFS or BFS to traverse and sink connected 1s upon discovery.'],
        },
        {
          title: 'Generate Subsets (Power Set)',
          topic: 'Recursion',
          difficulty: 'Medium',
          description:
            'Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.',
          examples: [
            {
              input: 'nums = [1,2,3]',
              output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]',
              explanation: 'All 2^N subsets generated.',
            },
          ],
          constraints: ['1 <= nums.length <= 10'],
          hints: ['Use backtracking: at each index, decide to either include or exclude the element.'],
        },
        {
          title: 'Binary Search',
          topic: 'Searching',
          difficulty: 'Easy',
          description:
            'Given an array of integers nums sorted in ascending order and an integer target, write a function to search target in nums in O(log n) time.',
          examples: [
            {
              input: 'nums = [-1,0,3,5,9,12], target = 9',
              output: '4',
              explanation: '9 exists in nums and its index is 4.',
            },
          ],
          constraints: ['1 <= nums.length <= 10^4', 'All integers in nums are unique.'],
          hints: ['Calculate mid = left + (right - left) / 2 to prevent integer overflow.'],
        },
        {
          title: 'Merge Intervals',
          topic: 'Sorting',
          difficulty: 'Medium',
          description:
            'Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals and return an array of non-overlapping intervals.',
          examples: [
            {
              input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
              output: '[[1,6],[8,10],[15,18]]',
              explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
            },
          ],
          constraints: ['1 <= intervals.length <= 10^4'],
          hints: ['Sort intervals by start time, then merge iteratively.'],
        },
        {
          title: 'Best Time to Buy and Sell Stock',
          topic: 'Greedy Algorithms',
          difficulty: 'Easy',
          description:
            'You are given an array prices where prices[i] is the price of a given stock on the ith day. Return the maximum profit you can achieve from this transaction.',
          examples: [
            {
              input: 'prices = [7,1,5,3,6,4]',
              output: '5',
              explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.',
            },
          ],
          constraints: ['1 <= prices.length <= 10^5'],
          hints: ['Track minimum price seen so far and maximum difference.'],
        },
        {
          title: 'Maximum Subarray (Kadane Algorithm)',
          topic: 'Dynamic Programming',
          difficulty: 'Medium',
          description:
            'Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.',
          examples: [
            {
              input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
              output: '6',
              explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
            },
          ],
          constraints: ['1 <= nums.length <= 10^5'],
          hints: ['Keep track of max ending at current index vs global maximum.'],
        },
        {
          title: 'Contains Duplicate',
          topic: 'Arrays',
          difficulty: 'Easy',
          description: 'Given an integer array nums, return true if any value appears at least twice.',
          examples: [
            {
              input: 'nums = [1,2,3,1]',
              output: 'true',
              explanation: '1 appears twice.',
            },
          ],
          constraints: ['1 <= nums.length <= 10^5'],
          hints: ['Use a HashSet while iterating.'],
        },
        {
          title: 'Climbing Stairs',
          topic: 'Dynamic Programming',
          difficulty: 'Easy',
          description:
            'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
          examples: [
            {
              input: 'n = 3',
              output: '3',
              explanation: '1+1+1, 1+2, and 2+1.',
            },
          ],
          constraints: ['1 <= n <= 45'],
          hints: ['This is the Fibonacci recurrence: ways(n) = ways(n-1) + ways(n-2).'],
        },
      ]);
      console.log('[Seed] Core DSA questions across all 11 topics seeded successfully.');
    }

    // 3. Seed Comprehensive Aptitude Questions
    const aptCount = await AptitudeQuestion.countDocuments();
    if (aptCount === 0) {
      await AptitudeQuestion.insertMany([
        // Quantitative Aptitude
        {
          question:
            'A train running at a speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?',
          category: 'Quantitative Aptitude',
          difficulty: 'Easy',
          options: ['120 metres', '150 metres', '180 metres', '324 metres'],
          correctAnswerIndex: 1, // 150 metres
          explanation:
            'Speed = 60 * (5/18) = 50/3 m/sec. Distance (length) = Speed * Time = (50/3) * 9 = 150 metres.',
        },
        {
          question:
            'If a person sells an article for $650 and gains 30%, what was the cost price of the article?',
          category: 'Quantitative Aptitude',
          difficulty: 'Medium',
          options: ['\$450', '\$500', '\$520', '\$550'],
          correctAnswerIndex: 1, // $500
          explanation: 'Cost Price = Selling Price / (1 + Profit%) = 650 / 1.30 = $500.',
        },
        {
          question:
            'A pipe can fill a tank in 6 hours and another pipe can empty it in 8 hours. If both pipes are opened together, in how many hours will the tank be full?',
          category: 'Quantitative Aptitude',
          difficulty: 'Medium',
          options: ['12 hours', '18 hours', '24 hours', '30 hours'],
          correctAnswerIndex: 2, // 24 hours
          explanation:
            'Net work per hour = 1/6 - 1/8 = (4 - 3)/24 = 1/24. Therefore, the tank fills in 24 hours.',
        },
        // Logical Reasoning
        {
          question:
            'Look at this number sequence: 2, 1, (1/2), (1/4), ... What number should come next?',
          category: 'Logical Reasoning',
          difficulty: 'Easy',
          options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'],
          correctAnswerIndex: 1, // (1/8)
          explanation:
            'This is a geometric division series; each successive number is multiplied by 1/2.',
        },
        {
          question:
            'Pointing to a photograph, a man said, "I have no brother or sister, but that man\'s father is my father\'s son." Whose photograph was it?',
          category: 'Logical Reasoning',
          difficulty: 'Medium',
          options: ['His nephew', 'His father', 'His son', 'His own'],
          correctAnswerIndex: 2, // His son
          explanation:
            'Since he has no brothers or sisters, "my father\'s son" is himself. Thus, "that man\'s father is me", meaning it is his son.',
        },
        // Verbal Ability
        {
          question:
            'Select the word that is most nearly opposite in meaning to ENORMOUS:',
          category: 'Verbal Ability',
          difficulty: 'Easy',
          options: ['Soft', 'Average', 'Tiny', 'Weak'],
          correctAnswerIndex: 2, // Tiny
          explanation: 'Enormous means extremely large. The direct antonym is tiny.',
        },
        {
          question:
            'Choose the word that best completes the sentence: The candidate\'s qualifications were _______ by the hiring committee after rigorous background verification.',
          category: 'Verbal Ability',
          difficulty: 'Medium',
          options: ['invalidated', 'authenticated', 'repudiated', 'obscured'],
          correctAnswerIndex: 1, // authenticated
          explanation:
            'Authenticated means proved or confirmed to be genuine, which fits verification context.',
        },
        // Data Interpretation
        {
          question:
            'In a company of 500 employees, 40% are in Software Engineering, 25% in Quality Assurance, 20% in DevOps, and the rest in HR. How many employees work in HR?',
          category: 'Data Interpretation',
          difficulty: 'Easy',
          options: ['50', '75', '80', '100'],
          correctAnswerIndex: 1, // 75
          explanation:
            'Total % accounted for = 40 + 25 + 20 = 85%. HR percentage = 100 - 85 = 15%. HR employees = 15% of 500 = 75.',
        },
        {
          question: 'If 12 workers can complete a job in 8 days, how many days will 16 workers take (same rate)?',
          category: 'Quantitative Aptitude',
          difficulty: 'Easy',
          options: ['4 days', '6 days', '8 days', '10 days'],
          correctAnswerIndex: 1,
          explanation: 'Work = 12 * 8 = 96 worker-days. Days = 96 / 16 = 6.',
        },
        {
          question: 'The average of 5 numbers is 20. If one number 30 is removed, what is the new average?',
          category: 'Quantitative Aptitude',
          difficulty: 'Medium',
          options: ['15', '16.5', '17.5', '18'],
          correctAnswerIndex: 2,
          explanation: 'Sum = 100. After removal, sum = 70; average = 70/4 = 17.5.',
        },
        {
          question:
            'Statements: All engineers are graduates. Some graduates are teachers. Conclusions: I. Some engineers are teachers. II. All teachers are engineers.',
          category: 'Logical Reasoning',
          difficulty: 'Medium',
          options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
          correctAnswerIndex: 3,
          explanation: 'The overlap between engineers and teachers is not guaranteed. Neither conclusion follows.',
        },
        {
          question: 'Find the odd one out: 3, 5, 11, 14, 17, 21',
          category: 'Logical Reasoning',
          difficulty: 'Easy',
          options: ['3', '14', '17', '21'],
          correctAnswerIndex: 1,
          explanation: '14 is even; the others are odd primes or odd numbers in the list pattern. 14 is the odd one out.',
        },
        {
          question: 'Choose the correctly spelled word:',
          category: 'Verbal Ability',
          difficulty: 'Easy',
          options: ['Accomodate', 'Acommodate', 'Accommodate', 'Acomodate'],
          correctAnswerIndex: 2,
          explanation: 'The standard spelling is Accommodate (two c\'s and two m\'s).',
        },
        {
          question: '“Benevolent” is closest in meaning to:',
          category: 'Verbal Ability',
          difficulty: 'Easy',
          options: ['Hostile', 'Kind', 'Confused', 'Silent'],
          correctAnswerIndex: 1,
          explanation: 'Benevolent means well-meaning and kindly.',
        },
        {
          question:
            'A bar chart shows campus offers: 40 in IT, 25 in Core, 15 in Consulting, 20 in Analytics. What percent of offers are in IT?',
          category: 'Data Interpretation',
          difficulty: 'Easy',
          options: ['30%', '40%', '45%', '50%'],
          correctAnswerIndex: 1,
          explanation: 'Total offers = 100. IT = 40, so 40%.',
        },
        {
          question:
            'If QA defects were 12, 18, 9, and 21 across four sprints, what is the average defects per sprint?',
          category: 'Data Interpretation',
          difficulty: 'Easy',
          options: ['12', '15', '18', '21'],
          correctAnswerIndex: 1,
          explanation: 'Sum = 60; average = 60/4 = 15.',
        },
      ]);
      console.log('[Seed] Core Aptitude questions across all 4 categories seeded successfully.');
    }
  } catch (error) {
    console.error(`[Seed Error] Could not seed sample data: ${error.message}`);
  }
};

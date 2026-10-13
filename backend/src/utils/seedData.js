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

    // 2. Seed Core DSA Questions
    const dsaCount = await DSAQuestion.countDocuments();
    if (dsaCount === 0) {
      await DSAQuestion.insertMany([
        {
          title: 'Two Sum',
          topic: 'Arrays',
          difficulty: 'Easy',
          description:
            'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input would have exactly one solution.',
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
            'A phrase is a palindrome if, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.',
          examples: [
            {
              input: 's = "A man, a plan, a canal: Panama"',
              output: 'true',
              explanation: '"amanaplanacanalpanama" is a palindrome.',
            },
          ],
          constraints: ['1 <= s.length <= 2 * 10^5'],
          hints: ['Use two pointers moving inward from both ends.'],
        },
        {
          title: 'Reverse Linked List',
          topic: 'Linked Lists',
          difficulty: 'Easy',
          description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
          examples: [
            {
              input: 'head = [1,2,3,4,5]',
              output: '[5,4,3,2,1]',
              explanation: 'The linked list order is reversed.',
            },
          ],
          constraints: ['0 <= Number of nodes <= 5000'],
          hints: ['Maintain prev, curr, and next pointers during traversal.'],
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
          hints: ['Push opening brackets onto stack, pop and verify on closing brackets.'],
        },
        {
          title: 'Maximum Subarray (Kadane Algorithm)',
          topic: 'Dynamic Programming',
          difficulty: 'Medium',
          description:
            'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
          examples: [
            {
              input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
              output: '6',
              explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
            },
          ],
          constraints: ['1 <= nums.length <= 10^5'],
          hints: ['Keep track of max ending here and max so far.'],
        },
        {
          title: 'Binary Tree Level Order Traversal',
          topic: 'Trees',
          difficulty: 'Medium',
          description:
            'Given the root of a binary tree, return the level order traversal of its nodes values (i.e., from left to right, level by level).',
          examples: [
            {
              input: 'root = [3,9,20,null,null,15,7]',
              output: '[[3],[9,20],[15,7]]',
              explanation: 'Nodes grouped by level depth.',
            },
          ],
          constraints: ['0 <= Number of nodes <= 2000'],
          hints: ['Use Breadth-First Search (BFS) with a queue.'],
        },
      ]);
      console.log('[Seed] Core DSA questions seeded successfully.');
    }

    // 3. Seed Sample Aptitude Questions
    const aptCount = await AptitudeQuestion.countDocuments();
    if (aptCount === 0) {
      await AptitudeQuestion.insertMany([
        {
          question:
            'A train running at a speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?',
          category: 'Quantitative Aptitude',
          difficulty: 'Easy',
          options: ['120 metres', '150 metres', '180 metres', '324 metres'],
          correctAnswerIndex: 1, // 150 metres
          explanation:
            'Speed = 60 * (5/18) = 50/3 m/sec. Length = Speed * Time = (50/3) * 9 = 150 metres.',
        },
        {
          question:
            'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?',
          category: 'Logical Reasoning',
          difficulty: 'Easy',
          options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'],
          correctAnswerIndex: 1, // (1/8)
          explanation: 'This is a division series; each number is half of the previous number.',
        },
        {
          question:
            'Find the word that is most nearly opposite in meaning to ENORMOUS:',
          category: 'Verbal Ability',
          difficulty: 'Easy',
          options: ['Soft', 'Average', 'Tiny', 'Weak'],
          correctAnswerIndex: 2, // Tiny
          explanation: 'Enormous means extremely large. Its opposite is tiny.',
        },
      ]);
      console.log('[Seed] Core Aptitude questions seeded successfully.');
    }
  } catch (error) {
    console.error(`[Seed Error] Could not seed sample data: ${error.message}`);
  }
};

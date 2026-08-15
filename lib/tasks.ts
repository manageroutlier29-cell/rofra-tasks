export interface Task {
  id: string;
  title: string;
  reward: number;
  category: 'Mathematics' | 'Physics' | 'Chemistry' | 'Economics';
  question: string;
}

export async function fetchAllTasks(): Promise<Task[]> {
  return [
    {
      id: '1',
      title: 'Mathematics: Quadratic Equation',
      reward: 50,
      category: 'Mathematics',
      question: 'Solve for x: x² - 5x + 6 = 0. Show all steps or state the final values of x.'
    },
    {
      id: '2',
      title: 'Physics: Newton\'s Second Law',
      reward: 60,
      category: 'Physics',
      question: 'A force of 20N is applied to a mass of 4kg. Calculate the acceleration of the object.'
    },
    {
      id: '3',
      title: 'Chemistry: Stoichiometry',
      reward: 55,
      category: 'Chemistry',
      question: 'What is the molar mass of Water (H₂O)? Given: H = 1 g/mol, O = 16 g/mol.'
    },
    {
      id: '4',
      title: 'Economics: Supply and Demand',
      reward: 65,
      category: 'Economics',
      question: 'Briefly explain what happens to the equilibrium price when supply decreases while demand remains constant.'
    }
  ];
}

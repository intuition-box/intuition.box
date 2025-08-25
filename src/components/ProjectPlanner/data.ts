import { Contributor, Project, Week, WeekGroup } from './types';

// Static contributor data
export const contributors: Contributor[] = [
  { id: 'jeremie-olivier', name: 'Zet', github: 'jeremie-olivier', discord: 'zet.box' },
  { id: 'alexandre-tedesco', name: 'Alexandre Tedesco', github: 'AlexandreTedesco', discord: 'lutin75' },
  { id: 'sasha-godel', name: 'Sasha Godel', github: 'MacDuPain', discord: 'mc_pa' },
  { id: 'maxime-ledato', name: 'Maxime Ledato', github: 'maximelodato', discord: 'maximelodato' },
  { id: 'thomas', name: 'Thomas', github: 'ZealRa', discord: 'zealr' },
  { id: 'thibault-lenormand', name: 'Thibault Lenormand', github: 'Thibault Lenormand', discord: 'thibault8536' },
  { id: 'james', name: 'James', github: 'JamesDev292', discord: 'shifou' },
  { id: 'paul-moulin', name: 'Paul Moulin', github: 'Dev-Moulin', discord: 'full750' },
  { id: 'luc', name: 'Luc', github: 'Warzieram', discord: 'warzieram' },
  { id: 'alexe-marichal', name: 'Alexe Marichal', github: 'Alexe', discord: 'alexe_22105' },
  { id: 'zaineb', name: 'Zaineb', github: 'ZainebPadilla', discord: 'zaineb_33081' },
  { id: 'christophe-alaterre', name: 'Christophe Alaterre', github: 'AkaKwak', discord: 'akakwak' },
  { id: 'sacha-courbe', name: 'Sacha Courbe', github: 'Sachathp', discord: 'blitzzbunny' },
  { id: 'sonia-ndione', name: 'Sonia Ndione', github: 'Sonia', discord: 'imsoniaahh8' },
  { id: 'maxime-saint-joannis', name: 'Maxime Saint-Joannis', github: 'Wieedze', discord: 'wieedze' },
  { id: 'samuel-chauche', name: 'Samuel Chauche', github: 'Samuel Chauche', discord: 'samuelchauche' },
  { id: 'lilian-muler', name: 'Lilian Muler', github: 'Istarengwa', discord: 'istarengwa' },
  { id: 'saulo-santos', name: 'Saulo Santos', github: 'saulodigital', discord: 'saulodigital' },
  { id: 'steven-raton', name: 'Steven Raton', github: 'stevenratton', discord: 'Omiage' },
  { id: 'rchis', name: 'rchis', github: 'rchis', discord: 'rchis' },
  { id: 'nuel', name: 'Nuel', github: 'Nuel', discord: 'nuel' },
];

// Static project data
export const projects: Project[] = [
  { id: 'graph', name: 'Graph' },
  { id: 'api-mock', name: 'API mock' },
  { id: 'ia-assistant', name: 'IA assistant' },
  { id: 'extension', name: 'Extension' },
  { id: 'plebs', name: 'Plebs' },
  { id: 'player-map', name: 'Player map' },
  { id: 'pulse', name: 'Pulse' },
  { id: 'sofia', name: 'Sofia' },
  { id: 'build-proof', name: 'BuildProof' },
  { id: 'n8n', name: 'n8n' },
  { id: 'organization-values', name: 'Organization Values' },
  { id: 'intuition-km', name: 'Intuition KM' },
];

// Generate weeks from November 2024 to now
export const generateWeeks = (): Week[] => {
  const weeks: Week[] = [];
  const startDate = new Date('2024-11-01');
  const currentDate = new Date();
  
  let currentWeek = new Date(startDate);
  
  // Find the Monday of the first week
  const dayOfWeek = currentWeek.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  currentWeek.setDate(currentWeek.getDate() + mondayOffset);
  
  while (currentWeek <= currentDate) {
    const monday = new Date(currentWeek);
    const sunday = new Date(currentWeek);
    sunday.setDate(sunday.getDate() + 6);
    
    const weekId = monday.toISOString().split('T')[0]; // "2024-11-04"
    const monthLabel = monday.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const label = `Mon ${monday.getDate()} → Sun ${sunday.getDate()}`;
    
    weeks.push({
      id: weekId,
      startDate: new Date(monday),
      endDate: new Date(sunday),
      label,
      monthLabel,
    });
    
    // Move to next week
    currentWeek.setDate(currentWeek.getDate() + 7);
  }
  
  return weeks;
};

// Group weeks by month
export const groupWeeksByMonth = (weeks: Week[]): WeekGroup[] => {
  const groupsMap = new Map<string, Week[]>();
  
  weeks.forEach(week => {
    const monthKey = week.monthLabel;
    if (!groupsMap.has(monthKey)) {
      groupsMap.set(monthKey, []);
    }
    groupsMap.get(monthKey)!.push(week);
  });
  
  return Array.from(groupsMap.entries()).map(([monthLabel, weeks]) => ({
    monthLabel,
    weeks: weeks.sort((a, b) => a.startDate.getTime() - b.startDate.getTime()),
  }));
};

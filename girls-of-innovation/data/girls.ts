export const girlsShare = 'Nearly half'

export const heroStats = [
  { label: 'Team founded', value: '2019' },
  { label: 'Girls in the team', value: girlsShare },
  { label: 'FRC team', value: '8828' }
]

export const aboutParagraphs = [
  'EAL Robotik started in 2019 as a small student club at Eskişehir Anadolu Lisesi. Today, team members work in mechanics, PR, software and electronics. Captains coordinate the work so members can share responsibilities across departments.',
  'Girls of Innovation grew out of the way we build robots together. Every member has room to contribute ideas, learn a technical role and take on leadership.',
  'Alumni come back to mentor current team members, who then teach the students joining after them.'
]

export const equalitySteps = [
  {
    title: 'Balanced recruitment',
    text: 'We check gender balance in each department when recruiting and build a mixed team of captains.'
  },
  {
    title: 'Girls in technical roles',
    text: 'Girls take on roles such as mechanical captain, battery lead and human player.'
  },
  {
    title: 'Leadership across departments',
    text: 'A girl has led mechanics and a boy has led PR. Team members can pursue the work that interests them.'
  },
  {
    title: 'Learning and teaching',
    text: 'Graduates mentor current members, who pass on their experience to new recruits.'
  }
]

export interface Barrier {
  label: string
  reveal: string
  stat: string
}

export const barriers: Barrier[] = [
  {
    label: 'Engineering is for boys',
    reveal: 'Girls help lead our build season at the workbench and in team meetings. A girl has been our mechanical captain.',
    stat: 'Mechanical leadership'
  },
  {
    label: 'Girls belong in PR',
    reveal: 'We choose captains based on their skills. A boy has led PR and girls have taken on technical leadership.',
    stat: 'Every department'
  },
  {
    label: 'Girls cannot handle the build season',
    reveal: 'Girls take on jobs such as battery lead, human player and build lead during the season.',
    stat: 'Build season roles'
  },
  {
    label: 'STEM is too hard for girls',
    reveal: 'Girls are nearly half our team and the share keeps growing every year.',
    stat: 'Nearly half our team'
  },
  {
    label: 'There are no role models',
    reveal: 'We learn from Marie Curie, Ada Lovelace and Katherine Johnson, and from the girls and women we work with today.',
    stat: 'Role models in STEM'
  },
  {
    label: 'Careers have a gender',
    reveal: 'Students can explore coding, mechanics, electronics and communications based on what they want to learn.',
    stat: 'Room to explore'
  }
]

export const pillars = [
  {
    title: 'Hands-on workshops',
    text: 'Seminars, practical activities and quizzes help students learn technical concepts and practice problem-solving together.'
  },
  {
    title: 'Mentorship and role models',
    text: 'Our Inoqueens conference brought together women from local FRC teams to share their experiences and discuss pioneers such as Marie Curie, Ada Lovelace and Katherine Johnson.'
  },
  {
    title: 'Community events',
    text: 'At events like our Diva Mark shirt-painting workshop, students from different teams get together and make things.'
  }
]

export const impactNotes = [
  'Girls made up a smaller share of the team in its early years. Today they lead and take on technical roles.',
  'We give students a place to try STEM skills and share the work of women in our local robotics community.',
  'We aim to help new FRC teams get started and grow in Türkiye and beyond.'
]

export const contact = {
  email: 'contact@ealrobotik.com',
  instagram: 'https://www.instagram.com/ealrobotik_8828',
  mainSite: 'https://ealrobotik.com/',
  school: 'Eskişehir Anadolu Lisesi'
}

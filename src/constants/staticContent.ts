export const HOW_BIORING_WORKS_STEPS = [
  {
    id: 'design',
    icon: 'pen',
    title: 'Custom Design',
    description: 'Choose the ring shape, material, and the story you want to preserve.'
  },
  {
    id: 'biometrics',
    icon: 'biometric',
    title: 'Biometric Collection',
    description: 'Record your voice, fingerprint, and heart rate to create a unique personal mark.'
  },
  {
    id: 'crafted',
    icon: 'gem',
    title: 'Unique Crafting',
    description: 'Bioring transforms this data into a one-of-a-kind IoT ring.'
  }
] as const

export const HOME_QUICK_ACTION = {
  eyebrow: 'Studio Ready',
  title: 'Start your BioRing design',
  description: 'Shape the ring, capture your biometric story, and preview a personal piece in the studio.',
  ctaLabel: 'Start Designing'
} as const

export const CUSTOMER_STORIES = [
  {
    eyebrow: 'Customer Story',
    title: 'A Unique Bond',
    quote:
      'The ring is more than just jewelry. It preserves the heartbeats and voices of loved ones in a truly unique way.',
    customerName: 'Minh Anh',
    customerMeta: 'BioRing owner, Hanoi',
    imageUrl: 'https://images.pexels.com/photos/1458352/pexels-photo-1458352.jpeg',
    statLabel: 'Personal moments crafted',
    statValue: '2.4K+'
  },
  {
    eyebrow: 'Customer Story',
    title: 'Connecting Across Distances',
    quote: 'Even from half a world away, I can still feel my wife’s heartbeat through this ring.',
    customerName: 'Hoàng Nam',
    customerMeta: 'Tech Engineer, Ho Chi Minh',
    imageUrl: 'https://images.pexels.com/photos/2659939/pexels-photo-2659939.jpeg',
    statLabel: 'Miles bridged',
    statValue: '12K+'
  },
  {
    eyebrow: 'Customer Story',
    title: 'An Anniversary Gift',
    quote:
      'This is the most meaningful anniversary gift I have ever received. It is like holding a sky full of memories.',
    customerName: 'Thanh Vân',
    customerMeta: 'Architect, Da Nang',
    imageUrl: 'https://images.pexels.com/photos/1232938/pexels-photo-1232938.jpeg',
    statLabel: 'Years of love',
    statValue: '10+'
  },
  {
    eyebrow: 'Customer Story',
    title: 'Melodies of Love',
    quote: 'My daughter’s voice is captured inside my ring. Whenever I miss her, I just touch it to hear her again.',
    customerName: 'Quốc Bảo',
    customerMeta: 'Freelancer, Can Tho',
    imageUrl: 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg',
    statLabel: 'Memories saved',
    statValue: '500+'
  },
  {
    eyebrow: 'Customer Story',
    title: 'An Invisible Thread',
    quote: 'I wear my BioRing as a reminder that I always have someone accompanying me through every challenge.',
    customerName: 'Lan Chi',
    customerMeta: 'Designer, Hai Phong',
    imageUrl: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg',
    statLabel: 'Days supported',
    statValue: '365+'
  }
] as const

export const STUDIO_CURRENT_DESIGN = {
  eyebrow: 'Current Design',
  name: 'Heartbeat Solitaire',
  status: 'Draft',
  updatedAt: 'Synced 12 min ago',
  description: 'A slim BioRing profile with fingerprint engraving and heartbeat memory prepared for personalization.'
} as const

export const STUDIO_SYNC_CONTENT = {
  eyebrow: 'Design Code Sync',
  title: 'Continue from Web',
  description: 'Enter your web design code to bring the current ring draft into this studio.',
  placeholder: 'BRG-2048',
  buttonLabel: 'Sync Design'
} as const

export const STUDIO_PROGRESS_STEPS = [
  {
    id: 'ring',
    label: 'Choose Ring',
    status: 'complete'
  },
  {
    id: 'personalize',
    label: 'Personalize',
    status: 'active'
  },
  {
    id: 'review',
    label: 'Review',
    status: 'pending'
  }
] as const

export const STUDIO_SIZE_GUIDE_ENTRY = {
  eyebrow: 'Ring Size',
  title: 'How to Measure Ring Size',
  description: 'Quickly measure at home with a ruler before personalizing your BioRing.',
  buttonLabel: 'View Guide'
} as const

export const STUDIO_SIZE_GUIDE_STEPS = [
  {
    id: 'prepare',
    title: 'Prepare Your Tools',
    description:
      'Use a ruler, a thin strip of paper, and a pen. Measure at the end of the day when finger size is most stable.'
  },
  {
    id: 'wrap',
    title: 'Wrap Your Finger',
    description:
      'Wrap the paper strip around your finger where you plan to wear the ring. Keep it snug, but not too tight, ensuring it can still slide over your knuckle.'
  },
  {
    id: 'mark',
    title: 'Mark the Intersection',
    description:
      'Mark the point where the two ends overlap, then lay the paper flat and measure the length in millimeters.'
  },
  {
    id: 'compare',
    title: 'Compare Measurements',
    description:
      'Use the measured millimeters as your finger circumference. If your measurement falls between two sizes, choose the larger one.'
  }
] as const

export const STUDIO_SIZE_TABLE = [
  { circumference: '49 - 51 mm', size: 'Size 5' },
  { circumference: '52 - 54 mm', size: 'Size 6' },
  { circumference: '55 - 57 mm', size: 'Size 7' },
  { circumference: '58 - 60 mm', size: 'Size 8' }
] as const

export const STUDIO_DIRECT_MEASURE = {
  title: 'Measure Your Finger',
  subtitle: 'Place your finger on the guide and match the width using the ruler.',
  infoTitle: 'How to align correctly',
  infoDescription:
    'Keep your phone flat on a table, look straight down from above, and align the widest part of your finger with the glowing guide. Avoid viewing from an angle because parallax can make the measurement look smaller or larger.',
  resultButton: 'Get the ring size',
  savedLabel: 'Saved to current draft'
} as const

export const STUDIO_MEASURE_OPTIONS = [
  { mm: 44, size: 'Size 3', diameter: '14.0 mm', fingerWidthClass: 'w-[70px]' },
  { mm: 45, size: 'Size 3.25', diameter: '14.3 mm', fingerWidthClass: 'w-[72px]' },
  { mm: 46, size: 'Size 3.5', diameter: '14.6 mm', fingerWidthClass: 'w-[73px]' },
  { mm: 47, size: 'Size 3.75', diameter: '15.0 mm', fingerWidthClass: 'w-[75px]' },
  { mm: 48, size: 'Size 4', diameter: '15.3 mm', fingerWidthClass: 'w-[76px]' },
  { mm: 49, size: 'Size 4.5', diameter: '15.6 mm', fingerWidthClass: 'w-[78px]' },
  { mm: 50, size: 'Size 5', diameter: '15.9 mm', fingerWidthClass: 'w-[79px]' },
  { mm: 51, size: 'Size 5.5', diameter: '16.2 mm', fingerWidthClass: 'w-[81px]' },
  { mm: 52, size: 'Size 6', diameter: '16.6 mm', fingerWidthClass: 'w-[82px]' },
  { mm: 53, size: 'Size 6.5', diameter: '16.9 mm', fingerWidthClass: 'w-[84px]' },
  { mm: 54, size: 'Size 7', diameter: '17.2 mm', fingerWidthClass: 'w-[86px]' },
  { mm: 55, size: 'Size 7.25', diameter: '17.5 mm', fingerWidthClass: 'w-[87px]' },
  { mm: 56, size: 'Size 7.5', diameter: '17.8 mm', fingerWidthClass: 'w-[89px]' },
  { mm: 57, size: 'Size 7.75', diameter: '18.1 mm', fingerWidthClass: 'w-[90px]' },
  { mm: 58, size: 'Size 8', diameter: '18.5 mm', fingerWidthClass: 'w-[92px]' },
  { mm: 59, size: 'Size 8.5', diameter: '18.8 mm', fingerWidthClass: 'w-[94px]' },
  { mm: 60, size: 'Size 9', diameter: '19.1 mm', fingerWidthClass: 'w-[95px]' },
  { mm: 61, size: 'Size 9.5', diameter: '19.4 mm', fingerWidthClass: 'w-[97px]' },
  { mm: 62, size: 'Size 10', diameter: '19.7 mm', fingerWidthClass: 'w-[98px]' }
] as const

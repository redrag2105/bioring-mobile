export type PosterElementId = 'photo' | 'date' | 'title' | 'message' | 'sound_wave' | 'heartbeat'

export type PosterElementFrame = {
  top: `${number}%`
  left: `${number}%`
  width: `${number}%`
  height: `${number}%`
  borderRadius?: number
  fontFamily?: string
  fontSize?: `${number}%`
  textAlign?: 'left' | 'center' | 'right'
  color?: string
  letterSpacing?: number
  textTransform?: 'none' | 'uppercase'
}

export type PosterTemplate = {
  id: string
  name: string
  caption: string
  backgroundImageUrl: string
  userPhotoPlaceholderUrl?: string
  backgroundClass: string
  elements: Record<PosterElementId, PosterElementFrame | undefined>
}

export const POSTER_MESSAGE_MAX_CHARS = 200

export const POSTER_MOCK_BIOMETRICS = {
  sound_wave: [18, 44, 28, 64, 38, 72, 26, 52, 86, 42, 58, 34, 68, 24, 48, 76, 36, 62, 30, 54],
  heartbeat: [8, 14, 58, 18, 10, 82, 22, 12, 46, 16, 8, 66, 24, 12, 52, 18]
}

export const POSTER_TEMPLATES: PosterTemplate[] = [
  {
    id: 'artistic-landscape',
    name: 'Artistic Landscape',
    caption: 'Cinematic widescreen crop, massive gallery negative space, and centered quiet typography.',
    backgroundImageUrl: 'https://dummyimage.com/1200x1600/ffffff/ffffff.png',
    userPhotoPlaceholderUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    backgroundClass: 'bg-white',
    elements: {
      date: {
        top: '8%',
        left: '10%',
        width: '80%',
        height: '4%',
        fontFamily: 'Lato',
        fontSize: '2.4%',
        textAlign: 'center',
        color: '#888888',
        letterSpacing: 4,
        textTransform: 'uppercase'
      },
      title: {
        top: '14%',
        left: '10%',
        width: '80%',
        height: '10%',
        fontFamily: 'Gretha-Medium',
        fontSize: '9%',
        textAlign: 'center',
        color: '#1A1A1A',
        letterSpacing: 2,
        textTransform: 'uppercase'
      },
      photo: {
        top: '26%',
        left: '8%',
        width: '84%',
        height: '38%',
        borderRadius: 4
      },
      message: {
        top: '68%',
        left: '15%',
        width: '70%',
        height: '16%',
        fontFamily: 'Lato',
        fontSize: '2.2%',
        textAlign: 'center',
        color: '#555555',
        letterSpacing: 1.8,
        textTransform: 'uppercase'
      },
      heartbeat: { top: '88%', left: '20%', width: '25%', height: '4%' },
      sound_wave: { top: '88%', left: '55%', width: '25%', height: '4%' }
    }
  },
  {
    id: 'minimalist-photo-bottom',
    name: 'Ivory Keepsake',
    caption: 'Warm ivory negative space, editorial typography, and a cinematic photo base.',
    backgroundImageUrl: 'https://dummyimage.com/1200x1600/f6eee2/f6eee2.png',
    userPhotoPlaceholderUrl:
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop&sat=-35',
    backgroundClass: 'bg-[#F6EEE2]',
    elements: {
      date: {
        top: '7%',
        left: '9%',
        width: '36%',
        height: '5%',
        fontFamily: 'Lato',
        fontSize: '2.5%',
        textAlign: 'left',
        color: '#A27959',
        letterSpacing: 2,
        textTransform: 'uppercase'
      },
      title: {
        top: '13%',
        left: '8%',
        width: '78%',
        height: '13%',
        fontFamily: 'Gretha-Medium',
        fontSize: '10%',
        textAlign: 'left',
        color: '#213C40',
        letterSpacing: 0.5,
        textTransform: 'none'
      },
      message: {
        top: '28%',
        left: '9%',
        width: '76%',
        height: '16%',
        fontFamily: 'Lato',
        fontSize: '2.3%',
        textAlign: 'left',
        color: '#6D6259',
        letterSpacing: 1.55,
        textTransform: 'uppercase'
      },
      heartbeat: { top: '46%', left: '9%', width: '30%', height: '5%' },
      sound_wave: { top: '46%', left: '48%', width: '42%', height: '5%' },
      photo: { top: '55%', left: '5%', width: '90%', height: '40%', borderRadius: 36 }
    }
  },
  {
    id: 'champagne-archive',
    name: 'Champagne Archive',
    caption: 'A soft ceremonial layout with an oval portrait, centered type, and a quiet SoundWave signature.',
    backgroundImageUrl: 'https://dummyimage.com/1200x1600/f5efe5/f5efe5.png',
    userPhotoPlaceholderUrl:
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1200&auto=format&fit=crop',
    backgroundClass: 'bg-[#F5EFE5]',
    elements: {
      photo: { top: '7%', left: '13%', width: '74%', height: '49%', borderRadius: 260 },
      date: {
        top: '60%',
        left: '18%',
        width: '64%',
        height: '4%',
        fontFamily: 'Lato',
        fontSize: '2.5%',
        textAlign: 'center',
        color: '#9B7D5C',
        letterSpacing: 2.4,
        textTransform: 'uppercase'
      },
      title: {
        top: '65%',
        left: '10%',
        width: '80%',
        height: '10%',
        fontFamily: 'Gretha-Medium',
        fontSize: '8.6%',
        textAlign: 'center',
        color: '#263F45',
        letterSpacing: 0.8,
        textTransform: 'none'
      },
      message: {
        top: '76%',
        left: '12%',
        width: '76%',
        height: '14%',
        fontFamily: 'Lato',
        fontSize: '2.2%',
        textAlign: 'center',
        color: '#6C6258',
        letterSpacing: 1.4,
        textTransform: 'uppercase'
      },
      heartbeat: { top: '92%', left: '16%', width: '30%', height: '4%' },
      sound_wave: { top: '92%', left: '54%', width: '30%', height: '4%' }
    }
  },
  {
    id: 'avant-garde-offset',
    name: 'Avant-Garde',
    caption: 'High-fashion asymmetry. Sharp corner bleeding imagery juxtaposed with strict left-aligned typography.',
    backgroundImageUrl: 'https://dummyimage.com/1200x1600/eae6e1/eae6e1.png',
    userPhotoPlaceholderUrl:
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1200&auto=format&fit=crop',
    backgroundClass: 'bg-[#EAE6E1]',
    elements: {
      photo: {
        top: '0%',
        left: '40%',
        width: '60%',
        height: '50%',
        borderRadius: 0
      },
      date: {
        top: '55%',
        left: '8%',
        width: '35%',
        height: '4%',
        fontFamily: 'Lato',
        fontSize: '2.4%',
        textAlign: 'left',
        color: '#7A726A',
        letterSpacing: 3,
        textTransform: 'uppercase'
      },
      title: {
        top: '61%',
        left: '8%',
        width: '84%',
        height: '10%',
        fontFamily: 'Gretha-Medium',
        fontSize: '11%',
        textAlign: 'left',
        color: '#2A2826',
        letterSpacing: -1,
        textTransform: 'none'
      },
      message: {
        top: '73%',
        left: '8%',
        width: '60%',
        height: '16%',
        fontFamily: 'Lato',
        fontSize: '2.2%',
        textAlign: 'left',
        color: '#55514E',
        letterSpacing: 1.4,
        textTransform: 'uppercase'
      },
      heartbeat: { top: '92%', left: '8%', width: '25%', height: '4%' },
      sound_wave: { top: '92%', left: '36%', width: '56%', height: '4%' }
    }
  },
  {
    id: 'nocturne-obsidian',
    name: 'Obsidian Capsule',
    caption: 'True luxury dark mode. A striking pill-shaped portrait framed by pristine golden typography.',
    backgroundImageUrl: 'https://dummyimage.com/1200x1600/0b0f12/0b0f12.png',
    userPhotoPlaceholderUrl:
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=1200&auto=format&fit=crop&sat=-20',
    backgroundClass: 'bg-[#0B0F12]',
    elements: {
      title: {
        top: '10%',
        left: '10%',
        width: '80%',
        height: '10%',
        fontFamily: 'Gretha-Medium',
        fontSize: '9%',
        textAlign: 'center',
        color: '#D4AF37',
        letterSpacing: 3,
        textTransform: 'uppercase'
      },
      date: {
        top: '19%',
        left: '20%',
        width: '60%',
        height: '4%',
        fontFamily: 'Lato',
        fontSize: '2.2%',
        textAlign: 'center',
        color: '#7E868C',
        letterSpacing: 5,
        textTransform: 'uppercase'
      },
      photo: {
        top: '26%',
        left: '28%',
        width: '44%',
        height: '48%',
        borderRadius: 999
      },
      message: {
        top: '76%',
        left: '12%',
        width: '76%',
        height: '13%',
        fontFamily: 'Lato',
        fontSize: '2.2%',
        textAlign: 'center',
        color: '#A1A8AD',
        letterSpacing: 2,
        textTransform: 'uppercase'
      },
      heartbeat: { top: '91%', left: '20%', width: '25%', height: '4%' },
      sound_wave: { top: '91%', left: '55%', width: '25%', height: '4%' }
    }
  },
  {
    id: 'royal-botanical',
    name: 'Royal Botanical',
    caption: 'Classic royal stationery. A deep forest backdrop contrasting beautifully with ivory text.',
    backgroundImageUrl: 'https://dummyimage.com/1200x1600/242c28/242c28.png',
    userPhotoPlaceholderUrl:
      'https://images.unsplash.com/photo-1507090960745-b32f65d3113a?q=80&w=1200&auto=format&fit=crop&sat=-25',
    backgroundClass: 'bg-[#242C28]',
    elements: {
      photo: {
        top: '6%',
        left: '12%',
        width: '76%',
        height: '44%',
        borderRadius: 12
      },
      title: {
        top: '53%',
        left: '10%',
        width: '80%',
        height: '10%',
        fontFamily: 'Gretha-Medium',
        fontSize: '10%',
        textAlign: 'center',
        color: '#F2E8D5',
        letterSpacing: 1,
        textTransform: 'none'
      },
      date: {
        top: '64%',
        left: '10%',
        width: '80%',
        height: '4%',
        fontFamily: 'Lato',
        fontSize: '2.4%',
        textAlign: 'center',
        color: '#B5A992',
        letterSpacing: 4,
        textTransform: 'uppercase'
      },
      message: {
        top: '71%',
        left: '10%',
        width: '80%',
        height: '15%',
        fontFamily: 'Lato',
        fontSize: '2.2%',
        textAlign: 'center',
        color: '#9CA69F',
        letterSpacing: 1.5,
        textTransform: 'uppercase'
      },
      heartbeat: { top: '88%', left: '15%', width: '32%', height: '4%' },
      sound_wave: { top: '88%', left: '53%', width: '32%', height: '4%' }
    }
  }
]

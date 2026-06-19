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
    caption: 'Gallery white space, quiet typography, balanced biometrics.',
    backgroundImageUrl: 'https://dummyimage.com/1200x1600/ffffff/ffffff.png',
    userPhotoPlaceholderUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    backgroundClass: 'bg-white',
    elements: {
      photo: { top: '7%', left: '7%', width: '86%', height: '39%', borderRadius: 28 },
      date: {
        top: '48%',
        left: '7%',
        width: '45%',
        height: '4%',
        fontFamily: 'Lato',
        fontSize: '2.7%',
        textAlign: 'left',
        color: '#7B6756',
        letterSpacing: 1.8,
        textTransform: 'uppercase'
      },
      title: {
        top: '53%',
        left: '7%',
        width: '86%',
        height: '10%',
        fontFamily: 'Gretha-Medium',
        fontSize: '8%',
        textAlign: 'left',
        color: '#5B4334',
        letterSpacing: 1.2,
        textTransform: 'uppercase'
      },
      message: {
        top: '64%',
        left: '7%',
        width: '78%',
        height: '13%',
        fontFamily: 'Lato',
        fontSize: '2.7%',
        textAlign: 'left',
        color: '#6A625C',
        letterSpacing: 1.6,
        textTransform: 'uppercase'
      },
      heartbeat: { top: '83%', left: '7%', width: '38%', height: '7%' },
      sound_wave: { top: '83%', left: '55%', width: '38%', height: '7%' }
    }
  },
  {
    id: 'minimalist-photo-bottom',
    name: 'Minimalist Photo Bottom',
    caption: 'Signature title, open space, photo anchored to the bottom.',
    backgroundImageUrl: 'https://dummyimage.com/1200x1600/f8f7f5/f8f7f5.png',
    userPhotoPlaceholderUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop&sat=-100',
    backgroundClass: 'bg-ring-background',
    elements: {
      date: {
        top: '6%',
        left: '63%',
        width: '30%',
        height: '5%',
        fontFamily: 'Lato',
        fontSize: '2.9%',
        textAlign: 'right',
        color: '#1A3642',
        letterSpacing: 1.4,
        textTransform: 'uppercase'
      },
      title: {
        top: '6%',
        left: '7%',
        width: '52%',
        height: '11%',
        fontFamily: 'Gretha-Regular',
        fontSize: '9%',
        textAlign: 'left',
        color: '#1A3642',
        textTransform: 'none'
      },
      heartbeat: { top: '18%', left: '58%', width: '34%', height: '7%' },
      sound_wave: { top: '29%', left: '58%', width: '34%', height: '7%' },
      message: {
        top: '34%',
        left: '10%',
        width: '52%',
        height: '20%',
        fontFamily: 'Lato',
        fontSize: '3.2%',
        textAlign: 'left',
        color: '#3D454C',
        letterSpacing: 1.2,
        textTransform: 'uppercase'
      },
      photo: { top: '56%', left: '0%', width: '100%', height: '44%', borderRadius: 0 }
    }
  }
]

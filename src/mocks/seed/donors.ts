import type { Donor } from '../../types'
import { CURRENT_DONOR } from './session'

const DONOR_NAMES = [
  'Priya Sharma',
  'Rohan Mehta',
  'Kavya Nair',
  'Arjun Reddy',
  'Sneha Iyer',
  'Rahul Kapoor',
  'Divya Pillai',
  'Karan Malhotra',
  'Meera Joshi',
  'Aditya Verma',
  'Pooja Desai',
  'Nikhil Bhatt',
  'Ishita Chatterjee',
  'Siddharth Rao',
  'Anjali Gupta',
  'Varun Kulkarni',
  'Neha Singh',
  'Aryan Kapoor',
  'Ritu Agarwal',
  'Manoj Pillai',
]

function daysAgoIso(days: number, hours = 0): string {
  return new Date(Date.now() - days * 86_400_000 - hours * 3_600_000).toISOString()
}

export const donors: Donor[] = [
  {
    id: CURRENT_DONOR.id,
    name: CURRENT_DONOR.name,
    email: CURRENT_DONOR.email,
    lifetimeValue: 6_420_000,
    giftCount: 11,
    firstGift: daysAgoIso(410),
    lastGift: daysAgoIso(3),
    recurring: true,
  },
  ...DONOR_NAMES.map((name, i) => ({
    id: 'dnr_' + (100 + i),
    name,
    email: name.toLowerCase().replace(' ', '.') + '@email.com',
    lifetimeValue: (8000 + ((i * 3137) % 62000)) * 100,
    giftCount: 2 + (i % 13),
    firstGift: daysAgoIso(400 + i * 17),
    lastGift: daysAgoIso(i * 2),
    recurring: i % 3 === 0,
  })),
]

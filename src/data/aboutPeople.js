/**
 * Static data for Executive Members, Advisory Board, and Referees on the About page.
 * Frontend architecture: unified structure { id, name, designation, image }
 * - name: full name
 * - designation: role/title (e.g. "President", "Advisory Board Member · Russia")
 * - image: imported asset or null (null = avatar placeholder)
 */

import ecAjayPratapSingh from '../assets/executiveCommittee/AjayPratapSingh.webp';
import ecHoma from '../assets/executiveCommittee/homa.webp';
import ecNavin from '../assets/executiveCommittee/navin.webp';
import ecRahul from '../assets/executiveCommittee/rahul.webp';
import ecRajkumar from '../assets/executiveCommittee/rajkumar.webp';

import ajBeleza from '../assets/advisoryBoard/AJ-Beleza.png';
import davoudJafari from '../assets/advisoryBoard/Davoud-jafari.jpg';
import maximTurushev from '../assets/advisoryBoard/Maxim-Turushev-russia.jpg';
import mdHelalAnNahiyan from '../assets/advisoryBoard/Md-Helal-An-Nahiyan.jpg';
import mrDambudzoRoyNyathi from '../assets/advisoryBoard/Mr.Dambudzo-Roy-Nyathi.jpg';
import ninaDrakulic from '../assets/advisoryBoard/Nina-Drakulic-Montenegro.jpg';
import orlandoAnach from '../assets/advisoryBoard/Orlando-anach.png';
import rahmanRasulzada from '../assets/advisoryBoard/Rahman-Rasulzada-Azer.jpg';
import salahEissa from '../assets/advisoryBoard/salah-eissa.jpg';
import waelAbbasKadhim from '../assets/advisoryBoard/WaelAbbasKadhim.jpg';

/** Executive Committee members: name, designation, image */
export const EXECUTIVE_MEMBERS = [
  { id: 'ec-1', name: 'Raj Kumar Sharma', designation: 'President', image: ecRajkumar },
  { id: 'ec-2', name: 'Ajay Pratap Singh', designation: 'Member, Executive Committee', image: ecAjayPratapSingh },
  { id: 'ec-3', name: 'Homa', designation: 'Member, Executive Committee', image: ecHoma },
  { id: 'ec-4', name: 'Navin', designation: 'Member, Executive Committee', image: ecNavin },
  { id: 'ec-5', name: 'Rahul', designation: 'Member, Executive Committee', image: ecRahul },
];

/**
 * Advisory Board — single source of truth for public About UIs (`/about#advisory`, partner About).
 * Not loaded from `/about-worso/people`; update this list and `src/assets/advisoryBoard/` when roster changes.
 */
export const ADVISORY_BOARD = [
  { id: 'ab-1', name: 'AJ Beleza', designation: 'Advisory Board Member', image: ajBeleza },
  { id: 'ab-4', name: 'Davoud Jafari', designation: 'Advisory Board Member', image: davoudJafari },
  { id: 'ab-5', name: 'Maxim Turushev', designation: 'Advisory Board Member · Russia', image: maximTurushev },
  { id: 'ab-6', name: 'Md Helal An Nahiyan', designation: 'Advisory Board Member', image: mdHelalAnNahiyan },
  { id: 'ab-7', name: 'Mr. Dambudzo Roy Nyathi', designation: 'Advisory Board Member', image: mrDambudzoRoyNyathi },
  { id: 'ab-8', name: 'Nina Drakulić', designation: 'Advisory Board Member · Montenegro', image: ninaDrakulic },
  { id: 'ab-9', name: 'Orlando Anach', designation: 'Advisory Board Member', image: orlandoAnach },
  { id: 'ab-10', name: 'Rahman Rasulzada', designation: 'Advisory Board Member · Azerbaijan', image: rahmanRasulzada },
  { id: 'ab-12', name: 'Salah Eissa', designation: 'Advisory Board Member', image: salahEissa },
  { id: 'ab-15', name: 'Wael Abbas Kadhim', designation: 'Advisory Board Member', image: waelAbbasKadhim },
];

/** Referees & Judges: name, designation, image (null = avatar placeholder) */
export const REFEREES = [
  { id: 'ref-1', name: 'Group Captain Rajiv Kumar Narang', designation: 'Referee · Drone Rescue', image: null },
  { id: 'ref-2', name: 'Lt. Luv Ravi', designation: 'Judge · RC Electric Car Racing', image: null },
  { id: 'ref-3', name: 'Dharmendra Sahu', designation: 'Referee · Robo Soccer', image: null },
  { id: 'ref-4', name: 'Rakesh Arya', designation: 'Referee · Robo Race', image: null },
  { id: 'ref-5', name: 'Mahabir Rawat', designation: 'Judge · Drone Soccer', image: null },
  { id: 'ref-6', name: 'Prashanta Bag', designation: 'Referee · Robo Soccer', image: null },
  { id: 'ref-7', name: 'Colonel Laxmi Kant Yadav', designation: 'Referee · RC Craft', image: null },
  { id: 'ref-8', name: 'Ganesh Pandit Suryawanshi', designation: 'Referee · Bots Combat', image: null },
  { id: 'ref-9', name: 'Satyajit Pangaonkar', designation: 'Referee · Maze Solve', image: null },
  { id: 'ref-10', name: 'Ashish Kumar', designation: 'Referee · Water Rocket', image: null },
  { id: 'ref-11', name: 'Dr. Munish Jindal', designation: 'Referee · RC Electric Car Racing', image: null },
  { id: 'ref-12', name: 'Sonu', designation: 'Referee · Robo Hockey', image: null },
  { id: 'ref-13', name: 'Sameer Sharma', designation: 'Judge · Bots Combat', image: null },
  { id: 'ref-14', name: 'Prashant Teke', designation: 'Judge · Water Rocket', image: null },
];

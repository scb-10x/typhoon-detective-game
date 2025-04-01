import { Case, Clue, Suspect } from '@/types/game';

export const defaultCases: Case[] = [
    {
        id: 'case-001',
        title: 'The Museum Heist',
        description: 'The priceless "Diamond of Destiny" has been stolen from the National Museum during a high-profile exhibition. Security cameras were disabled, and the thief left few traces behind. The museum director has hired you to solve this case discreetly before the press gets wind of the theft.',
        summary: 'A high-value diamond has been stolen from the National Museum with minimal evidence left behind.',
        location: 'National Museum',
        dateTime: '2023-11-15T22:30:00',
        difficulty: 'medium',
        solved: false,
        isLLMGenerated: false
    },
    {
        id: 'case-002',
        title: 'Vanishing Act',
        description: 'Famous magician Lorenzo Reed disappeared during his sold-out show at the Grand Theater. His final trick involved a locked water tank from which he never emerged. What initially appeared to be a tragic accident has taken a mysterious turn as his assistant received an anonymous note suggesting foul play.',
        summary: 'A famous magician vanished during his performance in a water tank escape trick.',
        location: 'Grand Theater',
        dateTime: '2023-12-05T20:45:00',
        difficulty: 'hard',
        solved: false,
        isLLMGenerated: false
    },
    {
        id: 'case-003',
        title: 'The Poisoned Pen',
        description: 'Renowned author Sophia Blake was found dead in her study while working on her latest bestseller. The autopsy revealed traces of a rare poison. Multiple people had motives to silence her, as her upcoming memoir threatened to expose secrets of several prominent figures in the publishing world.',
        summary: 'A bestselling author was poisoned while working on a revealing memoir.',
        location: 'Lakeside Mansion',
        dateTime: '2024-01-20T09:15:00',
        difficulty: 'easy',
        solved: false,
        isLLMGenerated: false
    }
];

export const defaultClues: Clue[] = [
    // Case 001: The Museum Heist
    {
        id: 'clue-001-1',
        caseId: 'case-001',
        title: 'Security Footage Gap',
        description: 'A 15-minute gap in the security footage between 10:15 PM and 10:30 PM. The system shows signs of being professionally tampered with.',
        location: 'Security Room',
        type: 'digital',
        discovered: true,
        examined: false,
        relevance: 'critical',
        imageUrl: '/clue.png'
    },
    {
        id: 'clue-001-2',
        caseId: 'case-001',
        title: 'Glass Cutter Tool',
        description: 'A high-end glass cutting tool found hidden in a janitor\'s closet near the exhibition hall. Has a custom grip modification.',
        location: 'Janitor Closet',
        type: 'physical',
        discovered: true,
        examined: false,
        relevance: 'important',
        imageUrl: '/clue.png'
    },
    {
        id: 'clue-001-3',
        caseId: 'case-001',
        title: 'Staff Schedule',
        description: 'The staff roster shows that security guard James Miller called in sick last minute on the night of the theft, resulting in a smaller security team than normal.',
        location: 'Admin Office',
        type: 'physical',
        discovered: true,
        examined: false,
        relevance: 'important',
        imageUrl: '/clue.png'
    },

    // Case 002: Vanishing Act
    {
        id: 'clue-002-1',
        caseId: 'case-002',
        title: 'Modified Water Tank',
        description: 'The escape mechanism in Lorenzo\'s water tank appears to have been subtly modified to malfunction. Changes would only be noticeable to someone familiar with the equipment.',
        location: 'Performance Stage',
        type: 'physical',
        discovered: true,
        examined: false,
        relevance: 'critical',
        imageUrl: '/clue.png'
    },
    {
        id: 'clue-002-2',
        caseId: 'case-002',
        title: 'Threatening Letter',
        description: 'A letter found in Lorenzo\'s dressing room warning him to "stop stealing what isn\'t yours or face the consequences". Written using cut-out magazine letters.',
        location: 'Dressing Room',
        type: 'physical',
        discovered: true,
        examined: false,
        relevance: 'important',
        imageUrl: '/clue.png'
    },

    // Case 003: The Poisoned Pen
    {
        id: 'clue-003-1',
        caseId: 'case-003',
        title: 'Poison Bottle',
        description: 'Empty vial of rare plant toxin found hidden behind books in the study. The toxin is derived from a plant native to South America, often used by researchers.',
        location: 'Study Bookshelf',
        type: 'physical',
        discovered: true,
        examined: false,
        relevance: 'critical',
        imageUrl: '/clue.png'
    },
    {
        id: 'clue-003-2',
        caseId: 'case-003',
        title: 'Manuscript Pages',
        description: 'Pages from Sophia\'s upcoming memoir containing damaging allegations about a prominent publisher accepting bribes to promote certain authors.',
        location: 'Desk Drawer',
        type: 'physical',
        discovered: true,
        examined: false,
        relevance: 'important',
        imageUrl: '/clue.png'
    },
    {
        id: 'clue-003-3',
        caseId: 'case-003',
        title: 'Tea Cup Residue',
        description: 'Chemical analysis of Sophia\'s tea cup shows traces of the poison. The cup has only her fingerprints, suggesting she prepared the tea herself or the killer wore gloves.',
        location: 'Study Desk',
        type: 'physical',
        discovered: true,
        examined: false,
        relevance: 'critical',
        imageUrl: '/clue.png'
    }
];

export const defaultSuspects: Suspect[] = [
    // Case 001: The Museum Heist
    {
        id: 'suspect-001-1',
        caseId: 'case-001',
        name: 'James Miller',
        description: 'Security guard who called in sick on the night of the theft. Has worked at the museum for 12 years.',
        background: 'James has been struggling with gambling debts. Recently purchased an expensive watch despite financial troubles.',
        motive: 'Needs money to pay off significant gambling debts to dangerous people. Could have been paid to look the other way or provide inside information.',
        alibi: 'Claims he was at home with food poisoning. No witnesses can confirm this.',
        isGuilty: false,
        interviewed: false,
        imageUrl: '/suspect.png'
    },
    {
        id: 'suspect-001-2',
        caseId: 'case-001',
        name: 'Vanessa Reid',
        description: 'Professional art thief known for high-profile heists across Europe. Recently spotted in the city.',
        background: 'Has a reputation for meticulous planning and leaving minimal evidence. Known to have connections to black market art collectors.',
        motive: 'The diamond would be a valuable addition to her resume and fetch millions from the right buyer.',
        alibi: 'Claims she was at a hotel bar during the time of the theft. Bartender confirms seeing her, but there\'s a 20-minute gap where she left to "take a call".',
        isGuilty: true,
        interviewed: false,
        imageUrl: '/suspect.png'
    },
    {
        id: 'suspect-001-3',
        caseId: 'case-001',
        name: 'Dr. Harold Thompson',
        description: 'Museum curator who oversees the precious gems exhibition. Has extensive knowledge of the security systems.',
        background: 'Recently divorced and facing alimony payments. Was passed over for promotion to museum director last year.',
        motive: 'Financial pressure from divorce. Also expressed bitterness about being overlooked for the director position.',
        alibi: 'Was attending a fundraising dinner across town. Multiple witnesses confirm his presence, though he left early claiming a headache.',
        isGuilty: false,
        interviewed: false,
        imageUrl: '/suspect.png'
    },

    // Case 002: Vanishing Act
    {
        id: 'suspect-002-1',
        caseId: 'case-002',
        name: 'Victor Reyes',
        description: 'Rival magician who has publicly accused Lorenzo of stealing his signature illusions.',
        background: 'Career has been overshadowed by Lorenzo\'s success. Recently had a show canceled due to poor ticket sales.',
        motive: 'Professional jealousy and accusations that Lorenzo stole his original trick designs.',
        alibi: 'Claims he was watching the show from the audience. Several attendees confirm seeing him, but he left his seat for approximately 15 minutes during intermission.',
        isGuilty: true,
        interviewed: false,
        imageUrl: '/suspect.png'
    },
    {
        id: 'suspect-002-2',
        caseId: 'case-002',
        name: 'Mina Chen',
        description: 'Lorenzo\'s assistant for the past five years. Knows all the mechanics of his illusions.',
        background: 'Has been trying to launch her own magic career but remains in Lorenzo\'s shadow. Recently had a public argument with Lorenzo over creative differences.',
        motive: 'Could gain publicity and step into the spotlight with Lorenzo gone. Had knowledge to tamper with the equipment.',
        alibi: 'Was on stage during the performance and visibly distressed when Lorenzo didn\'t emerge from the tank.',
        isGuilty: false,
        interviewed: false,
        imageUrl: '/suspect.png'
    },
    {
        id: 'suspect-002-3',
        caseId: 'case-002',
        name: 'Thomas Gardner',
        description: 'Theater technician who helped set up the water tank apparatus.',
        background: 'Recently fired from another theater for "negligence." Has a history of substance abuse but claims to be clean now.',
        motive: 'Had an altercation with Lorenzo during rehearsal when Lorenzo criticized his work in front of the crew.',
        alibi: 'Was operating lighting during the show. Colleagues confirm he was at his post, but the lighting booth has a clear view and access to the backstage area.',
        isGuilty: false,
        interviewed: false,
        imageUrl: '/suspect.png'
    },

    // Case 003: The Poisoned Pen
    {
        id: 'suspect-003-1',
        caseId: 'case-003',
        name: 'Maxwell Green',
        description: 'Powerful publisher mentioned in Sophia\'s memoir. Has a reputation for ruthless business tactics.',
        background: 'Built his publishing empire through questionable means. Sophia\'s memoir allegedly contained evidence of him bribing critics and manipulating bestseller lists.',
        motive: 'Sophia\'s memoir would damage his reputation and potentially lead to criminal charges for business practices.',
        alibi: 'Was at a publishing industry dinner across town. Numerous witnesses confirm, but he stepped out "to make calls" several times.',
        isGuilty: false,
        interviewed: false,
        imageUrl: '/suspect.png'
    },
    {
        id: 'suspect-003-2',
        caseId: 'case-003',
        name: 'Dr. Eleanor Reed',
        description: 'Botanist and former research colleague of Sophia\'s when she briefly worked in academia.',
        background: 'Expert in toxic plants and their properties. Had a falling out with Sophia over credit for research they conducted together years ago.',
        motive: 'Sophia\'s memoir allegedly revealed that Eleanor stole research and claimed it as her own, which would destroy her academic career.',
        alibi: 'Claims she was working late at her university laboratory. Security logs confirm she was in the building, but she could have left and returned unnoticed.',
        isGuilty: true,
        interviewed: false,
        imageUrl: '/suspect.png'
    },
    {
        id: 'suspect-003-3',
        caseId: 'case-003',
        name: 'Daniel Blake',
        description: 'Sophia\'s ex-husband who recently lost a bitter divorce settlement to her.',
        background: 'The divorce left him financially strained and publicly humiliated. Has been heard making threats about "getting even" with Sophia.',
        motive: 'Anger over the divorce settlement and ongoing alimony payments. Would inherit a valuable property if Sophia died within two years of the divorce.',
        alibi: 'Claims he was at home alone watching TV. Neighbor saw his car in the driveway, but cannot confirm he was actually inside the house.',
        isGuilty: false,
        interviewed: false,
        imageUrl: '/suspect.png'
    }
]; 
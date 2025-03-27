import { v4 as uuidv4 } from 'uuid';
import { Case, Clue, Suspect } from '@/types/game';

// Generate IDs for cases
const mysteryMansionId = uuidv4();
const corporateHeistId = uuidv4();
const hotelMysteryId = uuidv4();

// Sample Cases
export const sampleCases: Case[] = [
    {
        id: mysteryMansionId,
        title: "The Mystery at Blackwood Mansion",
        description: "A wealthy businessman, Richard Blackwood, has been found dead in his study at Blackwood Mansion. Initial reports suggest foul play, with the victim found slumped over his desk with a gunshot wound to his chest. The mansion was hosting a dinner party at the time of the murder, with five guests present.",
        summary: "Wealthy businessman Richard Blackwood found dead during a dinner party at his mansion.",
        difficulty: 'medium',
        solved: false,
        location: "Blackwood Mansion, countryside estate",
        dateTime: "2024-05-15T22:30:00Z",
        imageUrl: "https://images.unsplash.com/photo-1591005493328-5defee85702f",
        isLLMGenerated: false
    },
    {
        id: corporateHeistId,
        title: "The Corporate Heist",
        description: "TechFuture Corporation has reported a security breach resulting in the theft of their groundbreaking AI technology. The theft occurred during a high-profile tech conference where the company was planning to unveil their innovation. Security footage has been tampered with, and several employees had access to the secure area where the prototype was stored.",
        summary: "Revolutionary AI technology stolen from TechFuture Corporation during a major tech conference.",
        difficulty: 'hard',
        solved: false,
        location: "Global Tech Conference, Tokyo Convention Center",
        dateTime: "2024-06-02T16:45:00Z",
        imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095",
        isLLMGenerated: false
    },
    {
        id: hotelMysteryId,
        title: "Missing Artifact at Grand Hotel",
        description: "A valuable ancient artifact has disappeared from the exhibition room at the Grand Hotel. The artifact, a 3000-year-old golden amulet, was on display as part of a traveling exhibition. The security system was sophisticated, yet somehow the thief managed to bypass it without triggering any alarms. The theft was discovered during the morning inspection.",
        summary: "Valuable ancient golden amulet stolen from exhibition at Grand Hotel without triggering alarms.",
        difficulty: 'easy',
        solved: false,
        location: "Grand Hotel, Downtown District",
        dateTime: "2024-04-10T03:20:00Z",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        isLLMGenerated: false
    }
];

// Clues for The Mystery at Blackwood Mansion
export const blackwoodMansionClues: Clue[] = [
    {
        id: uuidv4(),
        caseId: mysteryMansionId,
        title: "Gun without fingerprints",
        description: "A .38 caliber revolver found on the floor near the victim's desk. The gun has been wiped clean of fingerprints. Ballistics confirm it as the murder weapon.",
        location: "On the floor of the study",
        type: "physical",
        discovered: true,
        examined: false,
        relevance: "critical"
    },
    {
        id: uuidv4(),
        caseId: mysteryMansionId,
        title: "Threatening letter",
        description: "A letter found in the victim's desk drawer, threatening consequences if 'the deal' doesn't go through. The letter is unsigned but typed on expensive stationery.",
        location: "Victim's desk drawer",
        type: "physical",
        discovered: true,
        examined: false,
        relevance: "important"
    },
    {
        id: uuidv4(),
        caseId: mysteryMansionId,
        title: "Butler's testimony",
        description: "The butler claims he heard an argument between Mr. Blackwood and Ms. Eleanor Hayes around 10:00 PM, approximately 30 minutes before the estimated time of death.",
        location: "Staff interview",
        type: "testimonial",
        discovered: true,
        examined: false,
        relevance: "important"
    },
    {
        id: uuidv4(),
        caseId: mysteryMansionId,
        title: "Broken wine glass",
        description: "A broken wine glass with residue of red wine found in the study's trash can. The glass has partial fingerprints matching Colonel Sanders.",
        location: "Study trash can",
        type: "physical",
        discovered: true,
        examined: false,
        relevance: "important"
    },
    {
        id: uuidv4(),
        caseId: mysteryMansionId,
        title: "Secret will",
        description: "A recently modified will hidden in a secret compartment of the bookshelf. The new will cuts out his brother Thomas and leaves everything to charity.",
        location: "Secret compartment in bookshelf",
        type: "physical",
        discovered: true,
        examined: false,
        relevance: "critical"
    },
    {
        id: uuidv4(),
        caseId: mysteryMansionId,
        title: "Muddy footprints",
        description: "A trail of muddy footprints leading from the garden door to the study and back. The shoe size matches multiple guests.",
        location: "Hallway to study",
        type: "physical",
        discovered: true,
        examined: false,
        relevance: "minor"
    }
];

// Suspects for The Mystery at Blackwood Mansion
export const blackwoodMansionSuspects: Suspect[] = [
    {
        id: uuidv4(),
        caseId: mysteryMansionId,
        name: "Thomas Blackwood",
        description: "The victim's younger brother and business rival",
        background: "Thomas has always lived in his brother's shadow. He works at the family company but holds a minor position despite his qualifications.",
        motive: "Recently discovered he was being cut out of the will in favor of charity donations. Stands to lose millions.",
        alibi: "Claims he was in the library reading at the time of the murder. No witnesses can confirm this.",
        interviewed: false,
        isGuilty: true
    },
    {
        id: uuidv4(),
        caseId: mysteryMansionId,
        name: "Eleanor Hayes",
        description: "The victim's personal assistant and rumored secret lover",
        background: "Has worked closely with Richard for 5 years. Extremely efficient and loyal, though some staff members suggest their relationship went beyond professional.",
        motive: "Recently had an argument with Richard. Some staff heard him threatening to fire her over a mistake with an important contract.",
        alibi: "Says she was on the phone with a client in the garden pavilion. Phone records confirm a call, but not her location.",
        interviewed: false,
        isGuilty: false
    },
    {
        id: uuidv4(),
        caseId: mysteryMansionId,
        name: "Colonel James Sanders",
        description: "A retired military officer and old friend of the victim",
        background: "Served in the military with Richard during their younger days. They've maintained a friendship, though rumors suggest they had a falling out recently over a business deal.",
        motive: "Lost a significant amount of money in a business venture Richard advised him on. Was heard demanding compensation at the party.",
        alibi: "Claims he was in the billiards room with other guests. Two guests confirm he was there until around 10:15 PM, but he was absent for about 20 minutes after that.",
        interviewed: false,
        isGuilty: false
    },
    {
        id: uuidv4(),
        caseId: mysteryMansionId,
        name: "Victoria Blackwood",
        description: "The victim's estranged wife",
        background: "Currently in divorce proceedings with Richard. The separation has been contentious, particularly regarding financial settlements.",
        motive: "The prenuptial agreement would give her very little in the divorce, but as a widow, she inherits a significant portion of his estate despite the new will.",
        alibi: "Says she was on the phone with her lawyer in her bedroom. Phone records confirm a brief call ended at 10:20 PM.",
        interviewed: false,
        isGuilty: false
    }
];

// Clues for The Corporate Heist
export const corporateHeistClues: Clue[] = [
    {
        id: uuidv4(),
        caseId: corporateHeistId,
        title: "Disabled security camera",
        description: "The security camera in the R&D department was disabled for exactly 7 minutes at 2:34 AM. The system shows it was deactivated using valid security credentials.",
        location: "Security monitoring room",
        type: "digital",
        discovered: true,
        examined: false,
        relevance: "critical"
    },
    {
        id: uuidv4(),
        caseId: corporateHeistId,
        title: "Employee access logs",
        description: "Access logs show five employees used their keycards to enter the building during after-hours the night of the theft. Three were authorized for late work.",
        location: "Security system database",
        type: "digital",
        discovered: true,
        examined: false,
        relevance: "critical"
    },
    {
        id: uuidv4(),
        caseId: corporateHeistId,
        title: "Suspicious email",
        description: "An email found in the trash folder of Dr. Zhang's computer, referring to 'delivery of the package' and a substantial payment. The sender used an encrypted email service.",
        location: "Dr. Zhang's computer",
        type: "digital",
        discovered: true,
        examined: false,
        relevance: "important"
    },
    {
        id: uuidv4(),
        caseId: corporateHeistId,
        title: "Janitor's testimony",
        description: "The night janitor reports seeing someone who looked like Sarah Chen working in the labs at around 2:30 AM, which is unusual for her department.",
        location: "Staff interview",
        type: "testimonial",
        discovered: true,
        examined: false,
        relevance: "important"
    },
    {
        id: uuidv4(),
        caseId: corporateHeistId,
        title: "Modified blueprint",
        description: "A digital blueprint of the AI prototype found on Marcus Wright's workstation shows recent modifications that weren't in the official documentation.",
        location: "Engineering department servers",
        type: "digital",
        discovered: true,
        examined: false,
        relevance: "minor"
    },
    {
        id: uuidv4(),
        caseId: corporateHeistId,
        title: "Rival company offer",
        description: "Document showing a job offer to Dr. Zhang from GlobalTech, TechFuture's main competitor, with an exceptionally high salary and benefits package.",
        location: "Dr. Zhang's personal email",
        type: "digital",
        discovered: true,
        examined: false,
        relevance: "important"
    }
];

// Suspects for The Corporate Heist
export const corporateHeistSuspects: Suspect[] = [
    {
        id: uuidv4(),
        caseId: corporateHeistId,
        name: "Dr. Mei Zhang",
        description: "Lead AI Researcher at TechFuture",
        background: "Brilliant researcher who has been with the company for 7 years. Recently passed over for promotion to Research Director despite being the most qualified candidate.",
        motive: "Reportedly bitter about being passed over for promotion. Has received an offer from a rival company with better compensation.",
        alibi: "Claims she was at home sleeping. Lives alone and has no witnesses to confirm her whereabouts.",
        interviewed: false,
        isGuilty: true
    },
    {
        id: uuidv4(),
        caseId: corporateHeistId,
        name: "Marcus Wright",
        description: "Senior Engineer who worked on the physical components of the AI prototype",
        background: "Has been with TechFuture for 12 years. Known for being extremely detail-oriented and protective of his work.",
        motive: "Recently had several of his design suggestions rejected by management. Was overheard complaining that the company doesn't value his contributions.",
        alibi: "Says he was working late in a different department, which his keycard logs confirm. However, there's a 20-minute gap where his whereabouts are unaccounted for.",
        interviewed: false,
        isGuilty: false
    },
    {
        id: uuidv4(),
        caseId: corporateHeistId,
        name: "Sarah Chen",
        description: "IT Security Specialist with access to all security systems",
        background: "Recently hired from a competitor company. Has extensive knowledge of security systems and how to bypass them.",
        motive: "No clear motive established, though her previous employer could benefit from the stolen technology.",
        alibi: "Claims she was at a bar with friends until 1 AM, then went home. Friends confirm she was at the bar, but no one can verify her location after that.",
        interviewed: false,
        isGuilty: false
    },
    {
        id: uuidv4(),
        caseId: corporateHeistId,
        name: "Robert Davidson",
        description: "Chief Financial Officer of TechFuture",
        background: "Has been with the company since its founding. Recently went through a costly divorce that left him in financial difficulty.",
        motive: "Financial problems could make him susceptible to bribes. The stolen technology would be worth millions on the black market.",
        alibi: "Says he was at home with his new girlfriend. She confirms his story, but they've only been dating for two weeks.",
        interviewed: false,
        isGuilty: false
    }
];

// Clues for Missing Artifact at Grand Hotel
export const hotelMysteryClues: Clue[] = [
    {
        id: uuidv4(),
        caseId: hotelMysteryId,
        title: "Security system logs",
        description: "The security system logs show no unauthorized access or alarms. However, there was a scheduled system update at 2:00 AM that caused the system to reboot, creating a 3-minute window where no data was recorded.",
        location: "Hotel security office",
        type: "digital",
        discovered: true,
        examined: false,
        relevance: "critical"
    },
    {
        id: uuidv4(),
        caseId: hotelMysteryId,
        title: "Maintenance hatch access",
        description: "A maintenance hatch in the ceiling of the corridor near the exhibition room shows signs of recent use. Dust patterns suggest someone moved through it recently.",
        location: "Corridor ceiling near exhibition room",
        type: "physical",
        discovered: true,
        examined: false,
        relevance: "critical"
    },
    {
        id: uuidv4(),
        caseId: hotelMysteryId,
        title: "Guest list",
        description: "The complete guest list of the hotel for the night of the theft. Of particular interest are three guests who checked in late the night before the theft and checked out immediately after the theft was discovered.",
        location: "Hotel reception records",
        type: "physical",
        discovered: true,
        examined: false,
        relevance: "important"
    },
    {
        id: uuidv4(),
        caseId: hotelMysteryId,
        title: "Night manager's testimony",
        description: "The night manager reports seeing Professor Reed examining the exhibition room's security features extensively during the day before the theft, claiming he was 'admiring the craftsmanship'.",
        location: "Staff interview",
        type: "testimonial",
        discovered: true,
        examined: false,
        relevance: "important"
    },
    {
        id: uuidv4(),
        caseId: hotelMysteryId,
        title: "Hotel map with notes",
        description: "A hotel map found in the trash of room 412, with handwritten notes marking staff entrances, security camera locations, and the exhibition room. The room was occupied by Ms. Grace Harper.",
        location: "Trash bin in room 412",
        type: "physical",
        discovered: true,
        examined: false,
        relevance: "critical"
    }
];

// Suspects for Missing Artifact at Grand Hotel
export const hotelMysterySuspects: Suspect[] = [
    {
        id: uuidv4(),
        caseId: hotelMysteryId,
        name: "Grace Harper",
        description: "Freelance journalist covering the exhibition",
        background: "Has written articles on archaeological exhibitions for various publications. Known for getting exclusive scoops by sometimes bending the rules.",
        motive: "Recently pitched a book about famous artifact heists to publishers. A firsthand account would make the book more valuable.",
        alibi: "Claims she was in her room all night working on an article. Hotel key card logs show her door was not opened between 11 PM and 7 AM.",
        interviewed: false,
        isGuilty: true
    },
    {
        id: uuidv4(),
        caseId: hotelMysteryId,
        name: "Professor James Reed",
        description: "Archaeologist consulting for the exhibition",
        background: "Respected archaeologist who discovered several similar artifacts. Helped authenticate the stolen amulet.",
        motive: "Previously claimed the amulet belonged in a museum in its country of origin, not in a traveling exhibition.",
        alibi: "Says he was having dinner with colleagues at the hotel restaurant until midnight, then retired to his room. Multiple witnesses confirm the dinner, but no one can verify his whereabouts after midnight.",
        interviewed: false,
        isGuilty: false
    },
    {
        id: uuidv4(),
        caseId: hotelMysteryId,
        name: "Daniel Wong",
        description: "Hotel security chief",
        background: "Former police officer with 15 years of experience in hotel security. Designed the security system for the exhibition room.",
        motive: "Recently passed over for promotion to hotel management despite his qualifications. Known to have financial problems due to gambling debts.",
        alibi: "Was on duty during the night of the theft. Security footage shows him patrolling other areas of the hotel during the estimated time of the theft.",
        interviewed: false,
        isGuilty: false
    }
];

// Combined export of all sample data
export const sampleData = {
    cases: sampleCases,
    clues: [
        ...blackwoodMansionClues,
        ...corporateHeistClues,
        ...hotelMysteryClues
    ],
    suspects: [
        ...blackwoodMansionSuspects,
        ...corporateHeistSuspects,
        ...hotelMysterySuspects
    ]
}; 
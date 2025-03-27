'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { thCases, thClues, thSuspects } from '@/data/translatedCases';

type Language = 'en' | 'th';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
    en: {
        // Common
        'app.title': 'Detective Game',
        'app.subtitle': 'Solve the case!',
        'app.loading': 'Loading...',
        'app.error': 'An error occurred',

        // Error messages
        'error.page_not_found': "We couldn't find the page you're looking for.",
        'error.return_home': 'Return to home page',

        // Progress indicators
        'progress.discovery': 'Discovery',
        'progress.analysis': 'Analysis',
        'progress.interview': 'Interview',
        'progress.solution': 'Solution',
        'progress.just_started': 'Just started',
        'progress.investigating': 'Investigating',
        'progress.making_progress': 'Making progress',
        'progress.almost_there': 'Almost there',
        'progress.complete': 'Complete',

        // Button labels
        'button.submit': 'Submit',
        'button.cancel': 'Cancel',
        'button.confirm': 'Confirm',
        'button.save': 'Save',
        'button.delete': 'Delete',
        'button.back': 'Back',
        'button.next': 'Next',
        'button.continue': 'Continue',
        'button.try_again': 'Try Again',
        'button.collect': 'Collect',
        'button.analyze': 'Analyze',
        'button.examine': 'Examine',
        'button.interview': 'Interview',
        'button.search': 'Search',
        'button.filter': 'Filter',

        // Navigation
        'nav.home': 'Home',
        'nav.cases': 'Cases',
        'nav.clues': 'Clues',
        'nav.suspects': 'Suspects',
        'nav.settings': 'Settings',
        'nav.back': 'Back',

        // Game
        'game.start': 'Start Investigation',
        'game.continue': 'Continue Investigation',
        'game.new_case': 'New Case',
        'game.collect_clue': 'Collect Clue',
        'game.examine_evidence': 'Examine Evidence',
        'game.interview_suspect': 'Interview Suspect',
        'game.solve_case': 'Solve Case',
        'game.reset': 'Reset Game',
        'game.reset_confirm': 'Confirm Reset Game',
        'game.reset_warning': 'Warning: This will delete all your progress and start over with sample cases.',

        // Cases
        'case.difficulty': 'Difficulty',
        'case.easy': 'Easy',
        'case.medium': 'Medium',
        'case.hard': 'Hard',
        'case.location': 'Location',
        'case.date': 'Date',
        'case.time': 'Time',
        'case.clues': 'Clues',
        'case.suspects': 'Suspects',
        'case.solution': 'Solution',
        'case.solved': 'Case Solved!',
        'case.unsolved': 'Case Unsolved',
        'case.progress': 'Progress',
        'case.search_placeholder': 'Search cases',
        'case.not_found': 'No cases found',
        'case.try_different_search': 'Try a different search term or create a new case.',
        'case.create_first': 'Start by creating your first case.',

        // Clues
        'clue.title': 'Clue',
        'clue.location': 'Found at',
        'clue.type': 'Type',
        'clue.relevance': 'Relevance',
        'clue.physical': 'Physical',
        'clue.digital': 'Digital',
        'clue.testimonial': 'Testimonial',
        'clue.critical': 'Critical',
        'clue.important': 'Important',
        'clue.minor': 'Minor',
        'clue.examine': 'Examine Clue',
        'clue.analysis': 'Analysis',
        'clue.connections': 'Connections',
        'clue.next_steps': 'Next Steps',
        'clue.not_found': 'Clue Not Found',
        'clue.does_not_exist': 'The clue you are looking for does not exist.',
        'clue.analysis_failed': 'Failed to analyze the clue. Please try again.',
        'clue.analyze': 'Analyze Clue',
        'clue.significance': 'Significance',
        'clue.possibleConnections': 'Possible Connections',
        'clue.questions': 'Questions to Consider',
        'clue.relatedCase': 'Related Case',
        'clue.relatedSuspects': 'Related Suspects',
        'clue.description': 'Description',
        'clue.condition': 'Condition',
        'clue.keywords': 'Keywords',
        'nav.back_to_cases': 'Back to Cases',
        'case.view': 'View Case',
        'suspect.view': 'View Suspect',

        // Suspects
        'suspect.name': 'Name',
        'suspect.description': 'Description',
        'suspect.background': 'Background',
        'suspect.motive': 'Motive',
        'suspect.alibi': 'Alibi',
        'suspect.interview': 'Interview',
        'suspect.ask_question': 'Ask Question',
        'suspect.custom_question': 'Custom Question',
        'suspect.suggested_questions': 'Suggested Questions',
        'suspect.trust_level': 'Trust Level',
        'suspect.inconsistencies': 'Inconsistencies',

        // Case Solving
        'solve.title': 'Solve the Case',
        'solve.instructions': 'Select the culprit, provide evidence, and explain your reasoning',
        'solve.select_suspect': 'Select the Culprit',
        'solve.select_evidence': 'Select Evidence',
        'solve.reasoning': 'Your Reasoning',
        'solve.min_evidence': 'Select at least 2 pieces of evidence',
        'solve.min_reasoning': 'Your reasoning should be at least 50 characters',
        'solve.submit': 'Submit Solution',
        'solve.analyzing': 'Analyzing your solution...',
        'solve.success': 'Congratulations! You solved the case!',
        'solve.failure': 'Your solution is incorrect. Try again!',
        'solve.return_to_case': 'Return to Case',

        // Settings
        'settings.language': 'Language',
        'settings.english': 'English',
        'settings.thai': 'Thai',
        'settings.theme': 'Theme',
        'settings.light': 'Light',
        'settings.dark': 'Dark',
        'settings.system': 'System',

        // Scene Investigation
        'scene.investigation': 'Scene Investigation',
        'scene.investigate': 'Investigate',
        'scene.instructions': 'Click on different areas of the scene to search for clues.',
        'scene.desk': 'Desk',
        'scene.window': 'Window',
        'scene.floor': 'Floor',
        'scene.bookshelf': 'Bookshelf',
        'scene.table': 'Table',
        'scene.found_clue': 'You found a clue!',
        'scene.clue_description': 'Examine this clue to learn more about the case.',
        'scene.nothing_found': 'You found nothing of interest here.',
        'scene.continue_search': 'Continue Searching',
        'case.does_not_exist': 'The case you are looking for does not exist.',
    },
    th: {
        // Common
        'app.title': 'เกมนักสืบ',
        'app.subtitle': 'ไขคดีปริศนา!',
        'app.loading': 'กำลังโหลด...',
        'app.error': 'เกิดข้อผิดพลาด',

        // Error messages
        'error.page_not_found': 'ไม่พบหน้าที่คุณกำลังค้นหา',
        'error.return_home': 'กลับไปยังหน้าหลัก',

        // Progress indicators
        'progress.discovery': 'ค้นพบ',
        'progress.analysis': 'วิเคราะห์',
        'progress.interview': 'สัมภาษณ์',
        'progress.solution': 'แก้ปริศนา',
        'progress.just_started': 'เพิ่งเริ่ม',
        'progress.investigating': 'กำลังสืบสวน',
        'progress.making_progress': 'คืบหน้า',
        'progress.almost_there': 'ใกล้สำเร็จ',
        'progress.complete': 'สำเร็จ',

        // Button labels
        'button.submit': 'ส่ง',
        'button.cancel': 'ยกเลิก',
        'button.confirm': 'ยืนยัน',
        'button.save': 'บันทึก',
        'button.delete': 'ลบ',
        'button.back': 'ย้อนกลับ',
        'button.next': 'ถัดไป',
        'button.continue': 'ดำเนินการต่อ',
        'button.try_again': 'ลองอีกครั้ง',
        'button.collect': 'เก็บ',
        'button.analyze': 'วิเคราะห์',
        'button.examine': 'ตรวจสอบ',
        'button.interview': 'สัมภาษณ์',
        'button.search': 'ค้นหา',
        'button.filter': 'กรอง',

        // Navigation
        'nav.home': 'หน้าหลัก',
        'nav.cases': 'คดี',
        'nav.clues': 'หลักฐาน',
        'nav.suspects': 'ผู้ต้องสงสัย',
        'nav.settings': 'ตั้งค่า',
        'nav.back': 'ย้อนกลับ',

        // Game
        'game.start': 'เริ่มการสืบสวน',
        'game.continue': 'สืบสวนต่อ',
        'game.new_case': 'คดีใหม่',
        'game.collect_clue': 'เก็บหลักฐาน',
        'game.examine_evidence': 'ตรวจสอบหลักฐาน',
        'game.interview_suspect': 'สัมภาษณ์ผู้ต้องสงสัย',
        'game.solve_case': 'ไขคดี',
        'game.reset': 'รีเซ็ตเกม',
        'game.reset_confirm': 'ยืนยันการรีเซ็ตเกม',
        'game.reset_warning': 'คำเตือน: นี่จะลบความคืบหน้าทั้งหมดของคุณและเริ่มต้นใหม่ด้วยคดีตัวอย่าง',

        // Cases
        'case.difficulty': 'ความยาก',
        'case.easy': 'ง่าย',
        'case.medium': 'ปานกลาง',
        'case.hard': 'ยาก',
        'case.location': 'สถานที่',
        'case.date': 'วันที่',
        'case.time': 'เวลา',
        'case.clues': 'หลักฐาน',
        'case.suspects': 'ผู้ต้องสงสัย',
        'case.solution': 'คำตอบ',
        'case.solved': 'คดีถูกไขแล้ว!',
        'case.unsolved': 'คดียังไม่ถูกไข',
        'case.progress': 'ความคืบหน้า',
        'case.search_placeholder': 'ค้นหาคดี',
        'case.not_found': 'ไม่พบคดี',
        'case.try_different_search': 'ลองค้นหาด้วยคำอื่นหรือสร้างคดีใหม่',
        'case.create_first': 'เริ่มต้นด้วยการสร้างคดีแรกของคุณ',

        // Clues
        'clue.title': 'หลักฐาน',
        'clue.location': 'พบที่',
        'clue.type': 'ประเภท',
        'clue.relevance': 'ความสำคัญ',
        'clue.physical': 'กายภาพ',
        'clue.digital': 'ดิจิทัล',
        'clue.testimonial': 'คำให้การ',
        'clue.critical': 'สำคัญมาก',
        'clue.important': 'สำคัญ',
        'clue.minor': 'ไม่สำคัญ',
        'clue.examine': 'ตรวจสอบหลักฐาน',
        'clue.analysis': 'การวิเคราะห์',
        'clue.connections': 'ความเชื่อมโยง',
        'clue.next_steps': 'ขั้นตอนต่อไป',
        'clue.not_found': 'ไม่พบหลักฐาน',
        'clue.does_not_exist': 'หลักฐานที่คุณกำลังค้นหาไม่มีอยู่',
        'clue.analysis_failed': 'การวิเคราะห์หลักฐานล้มเหลว โปรดลองอีกครั้ง',
        'clue.analyze': 'วิเคราะห์หลักฐาน',
        'clue.significance': 'ความสำคัญ',
        'clue.possibleConnections': 'ความเชื่อมโยงที่เป็นไปได้',
        'clue.questions': 'คำถามที่ควรพิจารณา',
        'clue.relatedCase': 'คดีที่เกี่ยวข้อง',
        'clue.relatedSuspects': 'ผู้ต้องสงสัยที่เกี่ยวข้อง',
        'clue.description': 'คำอธิบาย',
        'clue.condition': 'สภาพ',
        'clue.keywords': 'คำสำคัญ',
        'nav.back_to_cases': 'กลับไปยังคดี',
        'case.view': 'ดูคดี',
        'suspect.view': 'ดูผู้ต้องสงสัย',

        // Suspects
        'suspect.name': 'ชื่อ',
        'suspect.description': 'คำอธิบาย',
        'suspect.background': 'ประวัติ',
        'suspect.motive': 'แรงจูงใจ',
        'suspect.alibi': 'ข้ออ้างที่อยู่',
        'suspect.interview': 'สัมภาษณ์',
        'suspect.ask_question': 'ถามคำถาม',
        'suspect.custom_question': 'คำถามเฉพาะ',
        'suspect.suggested_questions': 'คำถามแนะนำ',
        'suspect.trust_level': 'ระดับความน่าเชื่อถือ',
        'suspect.inconsistencies': 'ความไม่สอดคล้อง',

        // Case Solving
        'solve.title': 'ไขคดี',
        'solve.instructions': 'เลือกผู้กระทำผิด ให้หลักฐาน และอธิบายเหตุผลของคุณ',
        'solve.select_suspect': 'เลือกผู้กระทำผิด',
        'solve.select_evidence': 'เลือกหลักฐาน',
        'solve.reasoning': 'เหตุผลของคุณ',
        'solve.min_evidence': 'เลือกหลักฐานอย่างน้อย 2 ชิ้น',
        'solve.min_reasoning': 'เหตุผลของคุณควรมีความยาวอย่างน้อย 50 ตัวอักษร',
        'solve.submit': 'ส่งคำตอบ',
        'solve.analyzing': 'กำลังวิเคราะห์คำตอบของคุณ...',
        'solve.success': 'ยินดีด้วย! คุณไขคดีสำเร็จ!',
        'solve.failure': 'คำตอบของคุณไม่ถูกต้อง ลองอีกครั้ง!',
        'solve.return_to_case': 'กลับไปที่คดี',

        // Settings
        'settings.language': 'ภาษา',
        'settings.english': 'อังกฤษ',
        'settings.thai': 'ไทย',
        'settings.theme': 'ธีม',
        'settings.light': 'สว่าง',
        'settings.dark': 'มืด',
        'settings.system': 'ตามระบบ',

        // Scene Investigation
        'scene.investigation': 'สำรวจสถานที่เกิดเหตุ',
        'scene.investigate': 'สำรวจ',
        'scene.instructions': 'คลิกที่บริเวณต่างๆ ของสถานที่เพื่อค้นหาหลักฐาน',
        'scene.desk': 'โต๊ะทำงาน',
        'scene.window': 'หน้าต่าง',
        'scene.floor': 'พื้น',
        'scene.bookshelf': 'ชั้นหนังสือ',
        'scene.table': 'โต๊ะ',
        'scene.found_clue': 'คุณพบหลักฐาน!',
        'scene.clue_description': 'ตรวจสอบหลักฐานนี้เพื่อเรียนรู้เพิ่มเติมเกี่ยวกับคดี',
        'scene.nothing_found': 'คุณไม่พบสิ่งที่น่าสนใจที่นี่',
        'scene.continue_search': 'ค้นหาต่อ',
        'case.does_not_exist': 'คดีที่คุณกำลังค้นหาไม่มีอยู่',
    },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Get initial language from localStorage or browser preference, default to English
    const [language, setLanguage] = useState<Language>('en');

    // On mount, try to load saved language preference
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'th')) {
            setLanguage(savedLanguage);
        } else {
            // Try to detect user's language from browser
            const userLanguage = navigator.language.split('-')[0];
            if (userLanguage === 'th') {
                setLanguage('th');
            }
        }
    }, []);

    // Save language preference when it changes
    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
    }, [language]);

    // Translation function
    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
} 
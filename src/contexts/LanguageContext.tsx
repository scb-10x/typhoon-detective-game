'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
        'app.title': 'Typhoon Detective',
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
        'nav.howToPlay': 'How to Play',
        'nav.howItWorks': 'How It Works',

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

        // How to Play
        'howToPlay.title': 'How to Play',
        'howToPlay.basics.title': 'Game Basics',
        'howToPlay.clues.title': 'Collecting Clues',
        'howToPlay.suspects.title': 'Questioning Suspects',
        'howToPlay.deduction.title': 'Making Your Deduction',
        'howToPlay.tips.title': 'Tips for Success',
        
        'howToPlay.basics.intro': 'Welcome to Typhoon Detective Game! This is an interactive detective game where you\'ll solve mysteries by gathering clues, interviewing suspects, and making deductions.',
        'howToPlay.basics.item1': 'Select a case from the Cases page',
        'howToPlay.basics.item2': 'Read the case briefing carefully',
        'howToPlay.basics.item3': 'Gather and analyze clues throughout the investigation',
        'howToPlay.basics.item4': 'Interview suspects to gather information',
        'howToPlay.basics.item5': 'Make your deduction when you think you\'ve solved the case',
        
        'howToPlay.clues.intro': 'Clues are essential to solving the case. You\'ll discover them as you progress through the story.',
        'howToPlay.clues.item1': 'Pay attention to the details in the story',
        'howToPlay.clues.item2': 'Some clues might be hidden or require special actions to discover',
        'howToPlay.clues.item3': 'Combine clues to form connections and develop theories',
        'howToPlay.clues.item4': 'Review your clues regularly in the Clues section',
        
        'howToPlay.suspects.intro': 'Interviewing suspects is crucial to gather information and understand motives.',
        'howToPlay.suspects.item1': 'Choose your questions carefully',
        'howToPlay.suspects.item2': 'Pay attention to suspicious behavior or contradictions',
        'howToPlay.suspects.item3': 'Use clues you\'ve discovered to challenge suspects\' stories',
        'howToPlay.suspects.item4': 'Take notes on what each suspect reveals',
        
        'howToPlay.deduction.intro': 'When you believe you\'ve solved the case, you\'ll need to make your final deduction.',
        'howToPlay.deduction.item1': 'Choose the suspect you believe is guilty',
        'howToPlay.deduction.item2': 'Provide evidence to support your accusation',
        'howToPlay.deduction.item3': 'Explain the motive behind the crime',
        'howToPlay.deduction.item4': 'If you\'re correct, you\'ll solve the case!',
        
        'howToPlay.tips.item1': 'Take your time and explore thoroughly',
        'howToPlay.tips.item2': 'Don\'t jump to conclusions too quickly',
        'howToPlay.tips.item3': 'Consider all possibilities before making your final deduction',
        'howToPlay.tips.item4': 'Pay attention to the timeline of events',
        'howToPlay.tips.item5': 'Look for connections between different clues and testimonies',
        'howToPlay.tips.item6': 'Trust your detective instincts!',

        // How It Works
        'howItWorks.title': 'How It Works',
        'howItWorks.intro': 'Typhoon Detective Game uses advanced AI technology to create an immersive detective experience. Learn about the underlying technology and algorithms that power the game.',
        
        'howItWorks.typhoonLLM.title': 'Typhoon LLM Technology',
        'howItWorks.typhoonLLM.intro': 'The game is powered by Typhoon, a powerful large language model (LLM) designed for complex reasoning and creative content generation.',
        'howItWorks.typhoonLLM.item1': 'Typhoon LLM handles natural language understanding and generation throughout the game',
        'howItWorks.typhoonLLM.item2': 'The model can process context-rich information to create coherent narratives',
        'howItWorks.typhoonLLM.item3': 'It utilizes advanced prompting techniques to maintain consistent game elements',
        'howItWorks.typhoonLLM.item4': 'The system uses different model variants optimized for different tasks',
        
        'howItWorks.caseGeneration.title': 'Dynamic Case Generation',
        'howItWorks.caseGeneration.intro': 'Each case in the game is uniquely generated using AI algorithms, creating endless possibilities for investigation.',
        'howItWorks.caseGeneration.item1': 'Cases are created by providing structured prompts to the Typhoon LLM',
        'howItWorks.caseGeneration.item2': 'The system ensures logical consistency between clues, suspects, and the solution',
        'howItWorks.caseGeneration.item3': 'Case parameters like theme, location, and difficulty level influence the generation process',
        'howItWorks.caseGeneration.item4': 'The AI generates case details, clue descriptions, suspect profiles, and a coherent solution',
        
        'howItWorks.clueAnalysis.title': 'Intelligent Clue Analysis',
        'howItWorks.clueAnalysis.intro': 'The game features a sophisticated clue analysis system that helps players investigate evidence.',
        'howItWorks.clueAnalysis.item1': 'Each clue is analyzed within the context of the current case and discovered evidence',
        'howItWorks.clueAnalysis.item2': 'The system identifies potential connections between clues and suspects',
        'howItWorks.clueAnalysis.item3': 'Analysis includes determining the significance of each piece of evidence',
        'howItWorks.clueAnalysis.item4': 'The AI suggests logical next investigative steps based on the current state of the case',
        
        'howItWorks.suspectInterviews.title': 'Dynamic Suspect Interviews',
        'howItWorks.suspectInterviews.intro': 'Interviews with suspects are powered by AI to create realistic and responsive questioning experiences.',
        'howItWorks.suspectInterviews.item1': 'Suspects respond based on their character profile, alibi, and relation to the case',
        'howItWorks.suspectInterviews.item2': 'The LLM maintains consistent character behavior throughout multiple interactions',
        'howItWorks.suspectInterviews.item3': 'Guilty suspects subtly behave differently than innocent ones, providing challenge for players',
        'howItWorks.suspectInterviews.item4': 'The system analyzes interview history to generate coherent follow-up responses',
        
        'howItWorks.caseSolving.title': 'Adaptive Solution Evaluation',
        'howItWorks.caseSolving.intro': 'The game evaluates player solutions using a comprehensive reasoning system.',
        'howItWorks.caseSolving.item1': 'The AI assesses whether the player correctly identified the culprit',
        'howItWorks.caseSolving.item2': 'It evaluates how well the selected evidence supports the player\'s reasoning',
        'howItWorks.caseSolving.item3': 'The system checks the logical consistency of the proposed solution',
        'howItWorks.caseSolving.item4': 'Players receive detailed feedback based on their solution attempt',

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
        'app.title': 'นักสืบไต้ฝุ่น',
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
        'nav.home': 'หน้าแรก',
        'nav.cases': 'คดี',
        'nav.clues': 'หลักฐาน',
        'nav.suspects': 'ผู้ต้องสงสัย',
        'nav.settings': 'ตั้งค่า',
        'nav.back': 'ย้อนกลับ',
        'nav.howToPlay': 'วิธีเล่น',
        'nav.howItWorks': 'ระบบการทำงาน',

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

        // How to Play
        'howToPlay.title': 'วิธีเล่น',
        'howToPlay.basics.title': 'พื้นฐานเกม',
        'howToPlay.clues.title': 'เก็บหลักฐาน',
        'howToPlay.suspects.title': 'สัมภาษณ์ผู้ต้องสงสัย',
        'howToPlay.deduction.title': 'การสรุปผล',
        'howToPlay.tips.title': 'เคล็ดลับสำหรับความสำเร็จ',
        
        'howToPlay.basics.intro': 'ยินดีต้อนรับสู่เกมสืบไต้ฝุ่น! เป็นเกมสืบไต้ฝุ่นที่นำความสนุกสนานมาสู่การสืบสวนคดีปริศนา',
        'howToPlay.basics.item1': 'เลือกคดีจากหน้าคดี',
        'howToPlay.basics.item2': 'อ่านบรรยายคดีด้วยความระมัดระวัง',
        'howToPlay.basics.item3': 'เก็บและวิเคราะห์หลักฐานตลอดการสืบสวน',
        'howToPlay.basics.item4': 'สัมภาษณ์ผู้ต้องสงสัยเพื่อเก็บข้อมูล',
        'howToPlay.basics.item5': 'สรุปผลเมื่อคุณคิดว่าคุณได้แก้คดีแล้ว',
        
        'howToPlay.clues.intro': 'หลักฐานเป็นสิ่งสำคัญในการแก้คดี คุณจะค้นพบหลักฐานตลอดการสืบสวนคดี',
        'howToPlay.clues.item1': 'จำรายละเอียดในเรื่อง',
        'howToPlay.clues.item2': 'บางหลักฐานอาจซ่อนอยู่หรือต้องทำการพิเศษเพื่อค้นพบ',
        'howToPlay.clues.item3': 'รวมหลักฐานเพื่อสร้างความเชื่อมโยงและพัฒนาทฤษฎี',
        'howToPlay.clues.item4': 'ตรวจสอบหลักฐานของคุณอย่างสม่ำเสมอในหน้าหลักหลักฐาน',
        
        'howToPlay.suspects.intro': 'การสัมภาษณ์ผู้ต้องสงสัยเป็นสิ่งสำคัญในการเก็บข้อมูลและเข้าใจแรงจูงใจ',
        'howToPlay.suspects.item1': 'เลือกคำถามด้วยความระมัดระวัง',
        'howToPlay.suspects.item2': 'จำระยะที่ผู้ต้องสงสัยมีพฤติกรรมที่ผิดปกติหรือขัดแย้ง',
        'howToPlay.suspects.item3': 'ใช้หลักฐานที่คุณได้ค้นพบเพื่อทดสอบคำพูดของผู้ต้องสงสัย',
        'howToPlay.suspects.item4': 'บันทึกสิ่งที่แต่ละผู้ต้องสงสัยระบุ',
        
        'howToPlay.deduction.intro': 'เมื่อคุณคิดว่าคุณได้แก้คดีแล้ว คุณจะต้องสรุปผลสุดท้าย',
        'howToPlay.deduction.item1': 'เลือกผู้กระทำผิดที่คุณเชื่อว่ามีความผิด',
        'howToPlay.deduction.item2': 'ให้หลักฐานเพื่อสนับสนุนการกล่าวหาผิด',
        'howToPlay.deduction.item3': 'อธิบายเหตุผลของความผิด',
        'howToPlay.deduction.item4': 'ถ้าคุณถูก คุณจะแก้คดีแล้ว!',
        
        'howToPlay.tips.item1': 'ใช้เวลาพิจารณาอย่างละเอียด',
        'howToPlay.tips.item2': 'อย่าตัดสิ่งที่คิดได้อย่างรวดเร็ว',
        'howToPlay.tips.item3': 'พิจารณาทุกทางเป็นไปได้ก่อนสรุปผลสุดท้าย',
        'howToPlay.tips.item4': 'จำระยะเวลาของเหตุการณ์',
        'howToPlay.tips.item5': 'มองหาความเชื่อมโยงระหว่างหลักฐานและคำพูดที่ยืนยัน',
        'howToPlay.tips.item6': 'ไว้วางความเชื่อของนักสืบคดีของคุณ!',

        // How It Works
        'howItWorks.title': 'ระบบการทำงาน',
        'howItWorks.intro': 'เกมนักสืบไต้ฝุ่นใช้เทคโนโลยี AI ขั้นสูงเพื่อสร้างประสบการณ์การสืบสวนที่สมจริง เรียนรู้เกี่ยวกับเทคโนโลยีและอัลกอริทึมที่ขับเคลื่อนเกมนี้',
        
        'howItWorks.typhoonLLM.title': 'เทคโนโลยี Typhoon LLM',
        'howItWorks.typhoonLLM.intro': 'เกมนี้ขับเคลื่อนโดย Typhoon ซึ่งเป็นโมเดลภาษาขนาดใหญ่ (LLM) ที่ทรงพลังและถูกออกแบบมาสำหรับการใช้เหตุผลที่ซับซ้อนและการสร้างเนื้อหาเชิงสร้างสรรค์',
        'howItWorks.typhoonLLM.item1': 'Typhoon LLM จัดการการเข้าใจและสร้างภาษาธรรมชาติตลอดทั้งเกม',
        'howItWorks.typhoonLLM.item2': 'โมเดลสามารถประมวลผลข้อมูลที่มีบริบทซับซ้อนเพื่อสร้างเรื่องราวที่ต่อเนื่อง',
        'howItWorks.typhoonLLM.item3': 'ใช้เทคนิคการกำหนดคำสั่งขั้นสูงเพื่อรักษาองค์ประกอบของเกมให้สอดคล้องกัน',
        'howItWorks.typhoonLLM.item4': 'ระบบใช้รุ่นโมเดลที่แตกต่างกันซึ่งเหมาะสมกับงานที่แตกต่างกัน',
        
        'howItWorks.caseGeneration.title': 'การสร้างคดีแบบไดนามิก',
        'howItWorks.caseGeneration.intro': 'คดีแต่ละคดีในเกมถูกสร้างขึ้นโดยเฉพาะด้วยอัลกอริทึม AI สร้างความเป็นไปได้ในการสืบสวนที่ไม่สิ้นสุด',
        'howItWorks.caseGeneration.item1': 'คดีถูกสร้างโดยการให้คำสั่งที่มีโครงสร้างกับ Typhoon LLM',
        'howItWorks.caseGeneration.item2': 'ระบบรับรองความสอดคล้องเชิงตรรกะระหว่างหลักฐาน ผู้ต้องสงสัย และคำตอบ',
        'howItWorks.caseGeneration.item3': 'พารามิเตอร์ของคดี เช่น ธีม สถานที่ และระดับความยาก มีอิทธิพลต่อกระบวนการสร้าง',
        'howItWorks.caseGeneration.item4': 'AI สร้างรายละเอียดของคดี คำอธิบายหลักฐาน โปรไฟล์ผู้ต้องสงสัย และคำตอบที่สอดคล้องกัน',
        
        'howItWorks.clueAnalysis.title': 'การวิเคราะห์หลักฐานอัจฉริยะ',
        'howItWorks.clueAnalysis.intro': 'เกมมีระบบวิเคราะห์หลักฐานที่ซับซ้อนซึ่งช่วยผู้เล่นในการตรวจสอบหลักฐาน',
        'howItWorks.clueAnalysis.item1': 'หลักฐานแต่ละชิ้นถูกวิเคราะห์ภายในบริบทของคดีปัจจุบันและหลักฐานที่ค้นพบแล้ว',
        'howItWorks.clueAnalysis.item2': 'ระบบระบุความเชื่อมโยงที่เป็นไปได้ระหว่างหลักฐานและผู้ต้องสงสัย',
        'howItWorks.clueAnalysis.item3': 'การวิเคราะห์รวมถึงการพิจารณาความสำคัญของหลักฐานแต่ละชิ้น',
        'howItWorks.clueAnalysis.item4': 'AI แนะนำขั้นตอนการสืบสวนต่อไปที่มีเหตุผลตามสถานะปัจจุบันของคดี',
        
        'howItWorks.suspectInterviews.title': 'การสัมภาษณ์ผู้ต้องสงสัยแบบไดนามิก',
        'howItWorks.suspectInterviews.intro': 'การสัมภาษณ์ผู้ต้องสงสัยขับเคลื่อนโดย AI เพื่อสร้างประสบการณ์การซักถามที่สมจริงและตอบสนอง',
        'howItWorks.suspectInterviews.item1': 'ผู้ต้องสงสัยตอบโต้ตามโปรไฟล์ตัวละคร ข้ออ้างที่อยู่ และความสัมพันธ์กับคดี',
        'howItWorks.suspectInterviews.item2': 'LLM รักษาพฤติกรรมตัวละครให้สอดคล้องกันตลอดการโต้ตอบหลายครั้ง',
        'howItWorks.suspectInterviews.item3': 'ผู้ต้องสงสัยที่มีความผิดจะมีพฤติกรรมที่แตกต่างจากผู้บริสุทธิ์เล็กน้อย ท้าทายผู้เล่น',
        'howItWorks.suspectInterviews.item4': 'ระบบวิเคราะห์ประวัติการสัมภาษณ์เพื่อสร้างการตอบสนองต่อเนื่องที่สอดคล้องกัน',
        
        'howItWorks.caseSolving.title': 'การประเมินการแก้ปัญหาอย่างยืดหยุ่น',
        'howItWorks.caseSolving.intro': 'เกมประเมินวิธีแก้ปัญหาของผู้เล่นโดยใช้ระบบการให้เหตุผลที่ครอบคลุม',
        'howItWorks.caseSolving.item1': 'AI ประเมินว่าผู้เล่นระบุตัวผู้กระทำผิดได้ถูกต้องหรือไม่',
        'howItWorks.caseSolving.item2': 'ระบบประเมินว่าหลักฐานที่เลือกสนับสนุนเหตุผลของผู้เล่นได้ดีเพียงใด',
        'howItWorks.caseSolving.item3': 'ระบบตรวจสอบความสอดคล้องเชิงตรรกะของการแก้ไขปัญหาที่เสนอ',
        'howItWorks.caseSolving.item4': 'ผู้เล่นได้รับข้อเสนอแนะโดยละเอียดตามความพยายามในการแก้ไข',

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
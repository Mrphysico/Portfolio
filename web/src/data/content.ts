/**
 * ============================================================================
 * ARTH JADAV: THE DIMENSIONAL PORTFOLIO — CORE CONTENT & FACTUAL REPOSITORIES
 * ============================================================================
 * STRICT INTEGRITY RULES:
 * 1. Never invent facts. Degrees, employers, or awards not in verified sources
 *    are marked with explicit TODO placeholders.
 * 2. Never include any phone numbers, UPI IDs, passwords, or secrets anywhere.
 * 3. All descriptions are grounded in verified GitHub repositories:
 *    - https://github.com/Mrphysico
 *    - https://github.com/Mrphysico/Amazon-clone
 *    - https://github.com/Mrphysico/MINOR-PROJECT-DEMO
 *    - https://github.com/Mrphysico/SMART-ACCIDENT-DETCETION-SYSTEM
 *    - https://github.com/Mrphysico/RigForge
 * ============================================================================
 */

export interface ProjectInfo {
  id: string;
  dimension: '1D' | '2D' | '3D' | '4D';
  dimensionTitle: string;
  title: string;
  tagline: string;
  repoUrl: string;
  liveUrl?: string;
  languages: string[];
  techStack: string[];
  summary: string;
  features: string[];
  narrative: string;
  metrics?: { label: string; value: string }[];
}

export interface PersonalInfo {
  name: string;
  role: string;
  githubUrl: string;
  linkedinUrl: string;
  // Explicit TODO placeholders for unverified personal details
  emailPlaceholder: string;
  resumePlaceholder: string;
  avatarPlaceholder: string;
  educationPlaceholder: string;
  bioPlaceholder: string;
}

export const PERSONAL_INFO: PersonalInfo = {
  name: "Arth Jadav",
  role: "Frontend Developer & Creative Coder",
  githubUrl: "https://github.com/Mrphysico",
  linkedinUrl: "https://www.linkedin.com/in/arth-jadav-05221435b",
  
  // TODO: Arth Jadav - Provide verified contact email
  emailPlaceholder: "contact@arthjadav.dev [TODO: Provide contact email]",
  
  // TODO: Arth Jadav - Provide URL to verified resume PDF
  resumePlaceholder: "/resume.pdf [TODO: Add verified resume PDF]",
  
  // TODO: Arth Jadav - Provide verified headshot photo
  avatarPlaceholder: "https://avatars.githubusercontent.com/u/163294866?v=4",
  
  // TODO: Arth Jadav - Provide degree, graduation year, and college name
  educationPlaceholder: "Computer Science & Engineering Student [TODO: Specify university and degree program]",
  
  // Grounded bio strictly reflecting creative frontend development and full-stack projects
  bioPlaceholder: "Creative frontend developer building immersive, high-performance web experiences with modern TypeScript, 3D graphics, and responsive systems.",
};

export const DIMENSIONAL_CHAPTERS: Record<'0D' | '1D' | '2D' | '3D' | '4D' | 'Singularity', {
  dimension: string;
  title: string;
  subtitle: string;
  coordinates: string;
  concept: string;
}> = {
  '0D': {
    dimension: '0D',
    title: 'The Point',
    subtitle: 'Zero Dimensions · Pure Potential',
    coordinates: '(0, 0, 0, 0)',
    concept: 'Before space, before time, a solitary photon oscillates at the singularity. An initial impulse expands into the big-bang particle birth.',
  },
  '1D': {
    dimension: '1D',
    title: 'The Line',
    subtitle: 'One Dimension · Direction & Beginning',
    coordinates: '(X)',
    concept: 'A single beam travels through the dark. The first line of code drawn on a blank canvas. Humble, honest, and nostalgic.',
  },
  '2D': {
    dimension: '2D',
    title: 'The Plane',
    subtitle: 'Two Dimensions · Area & Origami',
    coordinates: '(X, Y)',
    concept: 'Width meets height. Flat CSS planes, geometric layouts, and origami folds preparing to break into spatial depth.',
  },
  '3D': {
    dimension: '3D',
    title: 'The World',
    subtitle: 'Three Dimensions · Volume & System',
    coordinates: '(X, Y, Z)',
    concept: 'Depth is established. Real-time road networks, low-poly vehicles, sensor perimeters, and life-saving accident telemetry.',
  },
  '4D': {
    dimension: '4D',
    title: 'The Hyperspace',
    subtitle: 'Four Dimensions · Time & Hypervolume',
    coordinates: '(X, Y, Z, W)',
    concept: 'The flagship dimension. Hardware components assemble in 3D through time, then dissolve into rotating 4D tesseract hyperplanes.',
  },
  'Singularity': {
    dimension: 'Ω',
    title: 'Contact Singularity',
    subtitle: 'Infinite Density · The Convergence',
    coordinates: '(∞, ∞, ∞, ∞)',
    concept: 'All dimensions collapse through the event horizon into a gravitational lensing singularity where connections are forged.',
  },
};

export const PROJECTS: ProjectInfo[] = [
  {
    id: 'amazon-clone',
    dimension: '1D',
    dimensionTitle: 'The Line',
    title: 'Amazon Clone',
    tagline: 'My first project, learning from YouTube.',
    repoUrl: 'https://github.com/Mrphysico/Amazon-clone',
    languages: ['HTML', 'CSS'],
    techStack: ['HTML5', 'CSS3', 'Flexbox', 'Responsive Design'],
    summary: 'The spark that started the journey. Handcrafted HTML and CSS recreation of an e-commerce interface, built while learning web fundamentals from YouTube.',
    features: [
      'Semantic HTML structure mimicking modern storefront navigation',
      'Custom CSS styling with product card grids and promotional banners',
      'Learning milestone: understanding the box model, positioning, and media queries',
    ],
    narrative: 'Every developer remembers the first line of code that turned into a visible layout. This project represents the humility of beginning: curiosity, late-night tutorials, and the excitement of seeing a page come alive.',
    metrics: [
      { label: 'Created', value: 'Feb 2025' },
      { label: 'Language', value: '100% HTML/CSS' },
      { label: 'Type', value: 'First Web Project' },
    ],
  },
  {
    id: 'minor-project-demo',
    dimension: '2D',
    dimensionTitle: 'The Plane',
    title: 'Minor Project Demo',
    tagline: '6th-Semester Minor Project web application.',
    repoUrl: 'https://github.com/Mrphysico/MINOR-PROJECT-DEMO',
    languages: ['HTML', 'CSS', 'JavaScript'],
    techStack: ['HTML5', 'CSS3 Art', 'Vanilla JavaScript', 'DOM Manipulation'],
    summary: 'A 6th-semester academic project demonstrating structured UI components, interactive DOM manipulation, and flat 2D layout compositions.',
    features: [
      'Interactive user interface built with clean HTML and dedicated stylesheet',
      'Vanilla JavaScript event listeners for real-time DOM updates',
      'Academic milestone: transitioning from static markup to dynamic browser scripting',
    ],
    narrative: 'In two dimensions, forms gain shape and interaction. This project marked the transition from static markup to programmable logic, establishing fundamental software design patterns.',
    metrics: [
      { label: 'Milestone', value: '6th Semester' },
      { label: 'Architecture', value: 'Clean 3-Tier Web' },
      { label: 'Stack', value: 'HTML/CSS/JS' },
    ],
  },
  {
    id: 'smart-accident-detection',
    dimension: '3D',
    dimensionTitle: 'The World',
    title: 'Smart Accident Detection System',
    tagline: 'Government emergency accident detection & telemetry platform.',
    repoUrl: 'https://github.com/Mrphysico/SMART-ACCIDENT-DETCETION-SYSTEM',
    liveUrl: 'https://smart-accident-detcetion-system.onrender.com/',
    languages: ['Python', 'JavaScript', 'HTML'],
    techStack: ['FastAPI', 'Python', 'React Native / Expo', 'Uvicorn', 'SQLite/PostgreSQL', 'Render'],
    summary: 'A life-critical telematics system consisting of a high-concurrency FastAPI server, a real-time accident simulator, a centralized web command dashboard, and an Expo responder mobile application.',
    features: [
      'High-performance FastAPI backend with auto-generated OpenAPI documentation',
      'Automated accident simulator generating telematics packets every 30 seconds or on-demand',
      'Live command dashboard serving real-time vehicle coordinates and incident states',
      'Dedicated mobile responder application built with Expo / React Native',
      'Cloud deployment on Render with production health monitoring',
    ],
    narrative: 'When code enters the physical 3D world, software impacts human safety. This project coordinates edge telemetry, real-time backend processing, and frontline mobile dispatch to minimize emergency response times.',
    metrics: [
      { label: 'Backend', value: 'FastAPI (Python)' },
      { label: 'Simulator', value: '30s Telemetry Cadence' },
      { label: 'Mobile Client', value: 'Expo / React Native' },
      { label: 'Deployment', value: 'Render Cloud' },
    ],
  },
  {
    id: 'rigforge',
    dimension: '4D',
    dimensionTitle: 'The Hyperspace',
    title: 'RigForge',
    tagline: 'Full-Stack Custom PC Parts E-Commerce & Interactive Battle Rig Builder.',
    repoUrl: 'https://github.com/Mrphysico/RigForge',
    languages: ['TypeScript', 'JavaScript'],
    techStack: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    summary: 'The flagship engineering achievement: an interactive Battle Rig builder and specialized PC hardware e-commerce platform tailored for the Indian gaming and workstation ecosystem.',
    features: [
      'Real-Time Hardware Compatibility Engine: Dynamically matches CPU sockets (LGA1700, AM5, AM4) with motherboards, validates DDR4 vs DDR5 RAM, and computes physical clearance',
      'Dynamic Power Budget Calculator: Computes real-time system TDP wattage and recommends 80+ Bronze/Gold/Platinum PSUs with safe thermal headroom',
      'Estimated Gaming Performance Benchmarks: Instant visual FPS estimators for Cyberpunk 2077, Valorant, and GTA V across 1080p, 1440p, and 4K',
      'Indian Market Localization: Catalog prices in INR (₹) with dynamic 18% GST calculation, stock counters, and BlueDart logistics estimates',
      'Interactive UPI QR Checkout Flow: Scan & Pay interface with NPCI app integration (GPay, PhonePe, Paytm, Navi), 12-digit UTR verification, and tracking docket generation',
      '30-Minute Inactivity Auto-Logout: Strict security monitoring user interactions (mouse, keyboard, touch) with cross-tab synchronization via Storage events',
    ],
    narrative: 'In the fourth dimension, hardware evolves through time. RigForge assembles complex computational systems component by component, enforcing rigorous electrical and physical constraints with seamless real-time interactivity.',
    metrics: [
      { label: 'Architecture', value: 'Full-Stack MERN + TS' },
      { label: 'Security', value: '30-Min Idle Auto-Logout' },
      { label: 'Compatibility', value: 'LGA1700 / AM5 / AM4' },
      { label: 'Market', value: 'Indian Gaming (INR/GST)' },
    ],
  },
];

export interface LanguageStar {
  name: string;
  category: 'verified-projects' | 'used-in-portfolio' | 'exploring';
  color: string;
  helloWorld: string;
  fact: string;
  position: [number, number, number];
}

export const LANGUAGE_GALAXY: LanguageStar[] = [
  // 🟢 Verified in Arth's Projects (Strict Honesty)
  {
    name: 'TypeScript',
    category: 'verified-projects',
    color: '#3178c6',
    helloWorld: 'const greet = (name: string): string => `Hello, ${name}!`;',
    fact: 'Powers RigForge’s strict compatibility engine and component state.',
    position: [0, 0, 0],
  },
  {
    name: 'JavaScript',
    category: 'verified-projects',
    color: '#f7df1e',
    helloWorld: 'console.log("Hello, World!");',
    fact: 'Used across Minor Project Demo and web applications.',
    position: [3, 2, -2],
  },
  {
    name: 'Python',
    category: 'verified-projects',
    color: '#3776ab',
    helloWorld: 'print("Hello, World!")',
    fact: 'Powers the Smart Accident Detection System FastAPI server and telemetry simulator.',
    position: [-3, 1, 2],
  },
  {
    name: 'HTML',
    category: 'verified-projects',
    color: '#e34f26',
    helloWorld: '<h1>Hello, World!</h1>',
    fact: 'The starting point in Amazon Clone and web page structures.',
    position: [2, -3, 1],
  },
  {
    name: 'CSS',
    category: 'verified-projects',
    color: '#1572b6',
    helloWorld: 'body::before { content: "Hello, World!"; }',
    fact: 'Used for styling in Amazon Clone and Minor Project Demo.',
    position: [-2, -2, -1],
  },

  // 🔵 Used in This Dimensional Portfolio
  {
    name: 'Rust',
    category: 'used-in-portfolio',
    color: '#dea584',
    helloWorld: 'fn main() { println!("Hello, World!"); }',
    fact: 'Compiles to WebAssembly in /wasm-core for 4D rotation matrices and polytope math.',
    position: [5, 4, 3],
  },
  {
    name: 'Go',
    category: 'used-in-portfolio',
    color: '#00add8',
    helloWorld: 'package main\nimport "fmt"\nfunc main() { fmt.Println("Hello, World!") }',
    fact: 'Powers /realtime-go WebSocket server for live visitor presence and orbs.',
    position: [-5, 3, -3],
  },
  {
    name: 'GLSL',
    category: 'used-in-portfolio',
    color: '#5586a4',
    helloWorld: 'void main() { gl_FragColor = vec4(1.0); }',
    fact: 'Computes gravitational lensing, accretion disks, and holographic scanlines.',
    position: [4, -4, 2],
  },
  {
    name: 'WGSL',
    category: 'used-in-portfolio',
    color: '#639',
    helloWorld: '@compute @workgroup_size(64) fn main() { /* compute */ }',
    fact: 'WebGPU compute shader language driving 1,000,000 particle flow-fields.',
    position: [-4, -3, 4],
  },
  {
    name: 'SQL',
    category: 'used-in-portfolio',
    color: '#e38c00',
    helloWorld: 'SELECT "Hello, World!" AS greeting;',
    fact: 'Used for guestbook entries and analytics in SQLite/PostgreSQL.',
    position: [6, -1, -2],
  },
  {
    name: 'Bash',
    category: 'used-in-portfolio',
    color: '#4eaa25',
    helloWorld: 'echo "Hello, World!"',
    fact: 'Orchestrates CI/CD pipelines, Docker builds, and deployment scripts.',
    position: [-6, 2, 2],
  },

  // 🟣 Exploring / Curious (Honesty Rule: never claim mastery)
  { name: 'C', category: 'exploring', color: '#a8b9cc', helloWorld: '#include <stdio.h>\nint main(){ printf("Hello, World!"); return 0; }', fact: 'The foundation of modern operating systems and hardware-close computation.', position: [8, 5, -5] },
  { name: 'C++', category: 'exploring', color: '#00599c', helloWorld: '#include <iostream>\nint main(){ std::cout << "Hello, World!"; }', fact: 'Industry powerhouse for 3D game engines and high-performance graphics.', position: [-8, -5, 5] },
  { name: 'C#', category: 'exploring', color: '#239120', helloWorld: 'System.Console.WriteLine("Hello, World!");', fact: 'Standard language for Unity 3D development and enterprise services.', position: [7, 7, 2] },
  { name: 'Java', category: 'exploring', color: '#b07219', helloWorld: 'public class Main { public static void main(String[] args){ System.out.println("Hello"); } }', fact: 'Cross-platform enterprise workhorse and original Android foundation.', position: [-7, 6, -4] },
  { name: 'Kotlin', category: 'exploring', color: '#a97bff', helloWorld: 'fun main() = println("Hello, World!")', fact: 'Modern concise language for Android and multiplatform development.', position: [9, -4, 3] },
  { name: 'Swift', category: 'exploring', color: '#f05138', helloWorld: 'print("Hello, World!")', fact: 'Apple ecosystem language for iOS, macOS, and visionOS spatial computing.', position: [-9, 4, 6] },
  { name: 'PHP', category: 'exploring', color: '#4f5d95', helloWorld: '<?php echo "Hello, World!"; ?>', fact: 'Web veteran powering a vast portion of modern content management systems.', position: [6, -7, -3] },
  { name: 'Ruby', category: 'exploring', color: '#701516', helloWorld: 'puts "Hello, World!"', fact: 'Designed for programmer happiness, popularized by Ruby on Rails.', position: [-6, -6, -5] },
  { name: 'Lua', category: 'exploring', color: '#000080', helloWorld: 'print("Hello, World!")', fact: 'Ultra-lightweight embeddable scripting language used in game engines.', position: [5, 8, -6] },
  { name: 'Haskell', category: 'exploring', color: '#5e5086', helloWorld: 'main = putStrLn "Hello, World!"', fact: 'Purely functional programming with strong static mathematical typing.', position: [-5, 8, 4] },
  { name: 'Elixir', category: 'exploring', color: '#6e4a7e', helloWorld: 'IO.puts "Hello, World!"', fact: 'Runs on the Erlang BEAM VM for massive concurrency and fault tolerance.', position: [10, 2, -1] },
  { name: 'Scala', category: 'exploring', color: '#c22d40', helloWorld: 'object Main extends App { println("Hello, World!") }', fact: 'Bridges object-oriented and functional paradigms on the JVM.', position: [-10, -2, 2] },
  { name: 'Dart', category: 'exploring', color: '#00b4ab', helloWorld: 'void main() { print("Hello, World!"); }', fact: 'Powers Flutter for cross-platform mobile and desktop interfaces.', position: [4, 9, 3] },
  { name: 'Julia', category: 'exploring', color: '#a270ba', helloWorld: 'println("Hello, World!")', fact: 'Designed for high-performance numerical and scientific computing.', position: [-4, -9, -3] },
  { name: 'Zig', category: 'exploring', color: '#ec915c', helloWorld: 'const std = @import("std"); pub fn main() !void { std.debug.print("Hello\\n", .{}); }', fact: 'Modern systems language focusing on memory control without hidden control flow.', position: [11, -3, 4] },
  { name: 'Solidity', category: 'exploring', color: '#aa6746', helloWorld: '// EVM Contract\npragma solidity ^0.8.0;', fact: 'Smart contract programming language for the Ethereum Virtual Machine.', position: [-11, 3, -4] },
  { name: 'Assembly', category: 'exploring', color: '#6e60c8', helloWorld: 'mov edx, len\nmov ecx, msg\nmov ebx, 1\nmov eax, 4\nint 0x80', fact: 'Direct representation of machine code executed on the CPU.', position: [0, 11, -5] },
  { name: 'Brainfuck', category: 'exploring', color: '#2b2b2b', helloWorld: '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.', fact: 'Famous esoteric programming language with an 8-command instruction set.', position: [0, -11, 5] },
];

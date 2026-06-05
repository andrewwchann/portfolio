export const site = {
  name: "Andrew",
  tagline: "Software Engineering New Grad",
  photoUrl: "/profile.jpg",
  photoAlt: "Andrew Chan",
  email: "ajchan@ualberta.ca",
  github: "https://github.com/andrewwchann",
  linkedin: "https://www.linkedin.com/in/andrewchann/",
  resumeUrl: "/resume.pdf",
  skills: [
    "Python",
    "C++",
    "Java",
    "Kotlin",
    "Rust",
    "Lua",
    "SQL",
    "Git",
    "Linux",
    "Windows",
    "CI/CD",
    "Agile",
  ],
  about: [
    "I'm a developer passionate about solving real problems and building software that is both functional and efficient. I really enjoy working on things that have meaningful impact, whether thats for the people involved or the end user.",
    {
      parts: [
        "As of lately, I've been enjoying the process of learning robotics through building ",
        { text: "Cyberus", href: "#projects" },
        ".",
      ],
    },
    "Outside of my developer life, I enjoy rock climbing, golfing, snowboarding, eating good food, and taking the occasional photo :)",
  ],
  /** Add images to /public/about/ and list them here (hero uses profile.jpg separately) */
  aboutPhotos: [
    { src: "/about/photo-3.jpg", alt: "flowers" },
    { src: "/about/photo-2.jpg", alt: "cafe" },
    { src: "/about/photo-1.jpg", alt: "skyline" },
  ],
  experience: [
    {
      id: "exp-1",
      from: "2025-05",
      label: "May - Dec 2025",
      type: "Internship",
      role: "Driver Software Engineer Intern",
      org: "Subnet Solutions · Edmonton, AB",
      product: {
        name: "PowerSYSTEM Center",
        href: "https://subnet.com/products/powersystem-center/",
        tagline: "multi-vendor Operational Technology device management for utilities",
      },
      description: [
        "Return internship on Subnet's driver team with greater ownership.",
        "Assisted in building remote engineering access drivers, a Python UAT validation tool, and reverse-engineering DNP3 device communications to automate jobs across large device fleets.",
      ],
      tags: ["DNP3", "SCADA", "UAT", "C++", "Lua"],
    },
    {
      id: "exp-2",
      from: "2024-01",
      label: "Jan - Aug 2024",
      type: "Internship",
      role: "Driver Software Engineer Intern",
      org: "Subnet Solutions · Edmonton, AB",
      product: {
        name: "PowerSYSTEM Center",
        href: "https://subnet.com/products/powersystem-center/",
        tagline: "multi-vendor Operational Technology device management for utilities",
      },
      description: [
        "First internship on the driver team, mentored on a large multi-language codebase. I helped maintain protocol drivers that connect mixed-vendor substation devices to the platform.",
        "Fixed XML and C++/Lua bugs, extended JavaScript device scripts, and used Wireshark for packet-level debugging.",
      ],
      tags: ["C++", "Lua", "JavaScript", "Wireshark", "SCADA", "XML"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Cyberus Robotic Dog",
      description: "Designed and built the software for a robotic dog from hardware to software.",
      github: "https://github.com/andrewwchann/cyberus-controls",
      // demo: "https://your-demo-link.com",
      tags: ["Robotics", "Python", "OpenCV", "PWM motor control", "IMU", "Temperature", "Gait"],
      detail: {
        overview: [
          "Cyberus is a robotic dog where I developed the software stack controlling its hardware components, implementing a Master-Slave architecture for communication between a local client and a Jetson Orin Nano",
          "The goal of the project was to evaluate the quality of an onboard stereo camera by having the dog walk while recording temperature, IMU, and leg gait data. We then ran camera calibration and MTF experiments to assess image fidelity.",
          "I was responsible for the following:",
        ],
        highlights: [
          "Developing the controls software for the robotic dog",
          "Integrating and processing the stereo camera streams",
          "Retrieving sensor data from the hardware including IMU, temperature, and gait data",
          "Running camera calibration and MTF experiments",
          "Assisting with hardware and wiring placement within the dog body",
        ],
        videoUrl: "/projects/cyberus/dog_walk.mp4",
        architectureSrc: "/projects/cyberus/cyberus-architecture-diagram.png",
        flowSrc: "/projects/cyberus/decision-matrices.jpg",
        images: [
          { src: "/projects/cyberus/test-results.jpg", label: "Test Results" },
        ],
      },
    },
    {
      id: "proj-2",
      title: "Automated License Plate Recognition System",
      description:
        "An offline-first system that recognizes license plates using OCR and on-device ML.",
      github: "https://github.com/andrewwchann/Automated-License-Plate-Recognition-System",
      tags: ["Kotlin", "OCR", "Computer Vision", "ONNX", "Fast Plate OCR"],
      detail: {
        overview: [
          "This was my capstone project that was sponsored by Dr Nazarahari. The process of building this project was done through spec-driven development using SpecKit and Codex.",
          "The goal of the project was to create an offline-first system that recognizes license plates using OCR and on-device ML for parking enforcement at the UofA. During the design phase we decided to create a android app for the operators that is connected to a central db hosted in AWS. The violation data could then be reviewed by admins through a web portal.",
          "I was responsible for the following:",
        ],
        highlights: [
          "Developing the android app for the operators",
          "Implementing the OCR and on-device ML model pipeline for frame analysis",
          "Developing the communication between the android app and the central db",
          "Ensuring operator session data persistence across app restarts",
        ],
        videoUrl: "/projects/ALPR/alpr_demo.mp4",
        architectureSrc: "/projects/ALPR/alpr-architecture-diagram.png",
        flowSrc: "/projects/ALPR/ALPR-decision-matrices.jpg",
      },
    },
    {
      id: "proj-3",
      title: "Rust Poker Server",
      description:
        "A multiplayer poker server in Rust with Texas Hold'em, 5-Card Draw, and 7-Card Stud.",
      github: "https://github.com/andrewwchann/rust-poker-server",
      // demo: "https://your-demo-link.com",
      tags: ["Rust", "Multiplayer", "WebSockets", "Tokio"],
      detail: {
        overview: ["A multiplayer poker server in Rust with Texas Hold'em, 5-Card Draw, and 7-Card Stud. The server is designed to be used in a web browser and is built using the Tokio framework."],
        highlights: [
          "Designing the server architecture to handle multiple clients and poker varients",
          "Implementing the game state machines for each poker varient",
          "Implementing a SQLite database for storing user data",
          "Implementing web socket communication for client-server interactions",
        ],
        videoUrl: "/projects/poker/poker-demo.mp4",
        architectureSrc: "/projects/poker/rust-poker-architecture.jpg",
      },
    },
  ],
};

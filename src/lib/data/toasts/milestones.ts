import type { Toast } from "./types"

export const milestones: Toast[] = [
  {
    id: "milestone-3",
    img: "guide.png",
    type: "milestone",
    title: "3 year milestone!",
    trigger: ({ gameState }) => gameState.year.current === gameState.year.start + 3,
    message:
      "Nice work so far! Remember, your main focus is to increase calorie production. Keep it up!",
    button: "Dismiss"
  },
  {
    id: "milestone-5",
    img: "guide.png",
    type: "milestone",
    title: "5 year milestone!",
    trigger: ({ gameState }) => gameState.year.current === gameState.year.start + 5,
    message:
      "Nice work! A favourite quote of mine to keep you going: “Whatever lofty things you might accomplish today, you will do them only because you first ate something that grew out of dirt” – Barbara Kingsolver.",
    button: "Dismiss"
  },
  {
    id: "milestone-10",
    img: "guide.png",
    type: "milestone",
    title: "10 year milestone!",
    trigger: ({ gameState }) => gameState.year.current === gameState.year.start + 10,
    message:
      "Congratulations, you've made it to 10 years! You've been doing a great job so far, but the population is growing and you'll need to keep up the good work to feed everyone.",
    button: "Dismiss"
  },
  {
    id: "milestone-halfway",
    img: "guide.png",
    type: "milestone",
    title: "You're halfway there!",
    trigger: ({ gameState }) => gameState.year.current === gameState.year.start + 10,
    message: "You are half way there! Keep it going, the world is depending on you.",
    button: "Dismiss"
  },
  {
    id: "first-warning-water",
    img: "guide.png",
    type: "milestone",
    target: ".panel-1-3",
    title: "You just recieved your first environmental warning!",
    message:
      "Try use the data table to lower your freshwater use. Replace a water-intensive food with a low-water food that provides more calories per hectare.",
    trigger: ({ successMetrics }) => successMetrics.waterUseChange.warn,
    onEnter: ({ userState }) => {
      userState.toastIdsShown.push("first-warning-ghg")
    },
    button: "Dismiss"
  },
  {
    id: "first-warning-ghg",
    img: "guide.png",
    type: "milestone",
    target: ".panel-1-3",
    title: "You just recieved your first environmental warning!",
    message:
      "Try use the data table to lower your greenhouse gas emissions. Replace a high-emissions food with a lower-emissions one that provides more calories per hectare.",
    trigger: ({ successMetrics }) => successMetrics.emissionsChange.warn,
    onEnter: ({ userState }) => {
      userState.toastIdsShown.push("first-warning-water")
    },
    button: "Dismiss"
  }

  // {
  //   id: "milestone-animal-reduction",
  //   img: "guide.png",
  //   type: "milestone",
  //   title: "You have reduced animal !",
  //   trigger: ({gameState, farm: Farm}) => {
  //     farm
  //   }.start + 10,
  //   message: "",
  //   button: "Dismiss"
  // },
]

// Eat food. Not too much. Mostly plants. – Michael Pollan
// Each day, you have three votes to change the food system – Michael Pollan
// Whatever lofty things you might accomplish today, you will do them only because you first ate something that grew out of dirt – Barbara Kingsolver

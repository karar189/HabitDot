import Lifestyle from "/assets/create-challenge/Lifestyle.webp";
import Wellness from "/assets/create-challenge/Lifestyle.webp";
import Chores from "/assets/create-challenge/Lifestyle.webp";
import Skills from "/assets/create-challenge/Lifestyle.webp";
import Quitting from "/assets/create-challenge/Lifestyle.webp";
import ScreenTime from "/assets/create-challenge/Lifestyle.webp";

export const categories = [
  {
    name: "Lifestyle",
    id: 5,
    image: Lifestyle,
    defaultDescription: "Record your singing and receive votes.",
    subcategories: [
      {
        name: "Wellness",
        id: 51,
        image: Wellness,
        defaultDescription: "Focus on your physical and mental well-being.",
      },
      {
        name: "Chores",
        id: 52,
        image: Chores,
        defaultDescription: "Get tasks done efficiently and on time.",
      },
      {
        name: "Skills",
        id: 53,
        image: Skills,
        defaultDescription: "Learn and showcase new skills.",
      },
      {
        name: "Quitting",
        id: 54,
        image: Quitting,
        defaultDescription: "Break free from unhealthy habits.",
      },
      {
        name: "Screen Time",
        id: 55,
        image: ScreenTime,
        defaultDescription: "Manage and reduce your screen time.",
      },
    ],
  },
];

export const categoryImageMap = {
  5: Lifestyle,
  51: Wellness,
  52: Chores,
  53: Skills,
  54: Quitting,
  55: ScreenTime,
};

export const getCategoryIcon = (categoryId) => {
  console.log("Category ID received:", categoryId);
  const icon = categoryImageMap[categoryId] || null;
  console.log("Category icon returned:", icon);
  return icon;
};

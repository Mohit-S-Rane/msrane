import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";
import data from '/repository/data.json';

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("workItemsContainer");

  try {
    const { projects } = data;

    for (let i = 0; i < projects.length; i += 2) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");

      [projects[i], projects[i + 1]].forEach(project => {
        if (!project) return;

        const workItem = document.createElement("div");
        workItem.classList.add("work-item");

        workItem.innerHTML = `
          <div class="work-item-img">
            <a href="/project.html#${project.slug}">
              <img src="${project.image}" alt="${project.title}" />
            </a>
          </div>
          <div class="work-item-content">
            <h3>${project.title}</h3>
            <p class="mn">${project.description}</p>
          </div>
        `;

        rowDiv.appendChild(workItem);
      });

      container.appendChild(rowDiv);
    }
  } catch (err) {
    console.error("Failed to load project data:", err);
    container.innerHTML = "<p>Error loading projects.</p>";
  }
  
  const isWorkPage = document.querySelector(".page.work-page");
  if (!isWorkPage) return;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  let scrollTriggerInstances = [];

  const initHeaderAnimations = () => {
    gsap.set(".work-profile-icon", { scale: 0 });
    gsap.set(".work-header-arrow-icon", { scale: 0 });

    const feastText = SplitText.create(".work-header-content p", {
      type: "lines",
      mask: "lines",
    });

    const titleText = SplitText.create(".work-header-title h1", {
      type: "lines",
      mask: "lines",
    });

    gsap.set([feastText.lines, titleText.lines], {
      y: "120%",
    });

    const headerTl = gsap.timeline({ delay: 0.75 });

    headerTl.to(".work-profile-icon", {
      scale: 1,
      duration: 1,
      ease: "power4.out",
    });

    headerTl.to(
      feastText.lines,
      {
        y: "0%",
        duration: 1,
        ease: "power4.out",
      },
      "-=0.9"
    );

    headerTl.to(
      titleText.lines,
      {
        y: "0%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
      },
      "-=0.9"
    );

    headerTl.to(
      ".work-header-arrow-icon",
      {
        scale: 1,
        duration: 0.75,
        ease: "power4.out",
      },
      "-=0.9"
    );
  };

  const initAnimations = () => {
    scrollTriggerInstances.forEach((instance) => {
      if (instance) instance.kill();
    });
    scrollTriggerInstances = [];

    gsap.set(".work-item", {
      opacity: 0,
      scale: 0.75,
    });

    document.querySelectorAll(".work-items .row").forEach((row, index) => {
      const workItems = row.querySelectorAll(".work-item");

      workItems.forEach((item, itemIndex) => {
        const fromLeft = itemIndex % 2 === 0;

        gsap.set(item, {
          x: fromLeft ? -1000 : 1000,
          rotation: fromLeft ? -50 : 50,
          transformOrigin: "center center",
        });
      });

      const trigger = ScrollTrigger.create({
        trigger: row,
        start: "top 75%",
        onEnter: () => {
          gsap.timeline().to(workItems, {
            duration: 1,
            x: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            ease: "power4.out",
          });
        },
      });
      scrollTriggerInstances.push(trigger);
    });

    ScrollTrigger.refresh();
  };

  initHeaderAnimations();
  initAnimations();

  window.addEventListener("resize", () => {
    initAnimations();
  });
});

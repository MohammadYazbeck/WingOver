"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { menuCategories, menuItems, sauceCircles, type MenuCategory } from "@/lib/menu-data";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("Wings");
  const items = activeCategory === "Sauces" ? [] : menuItems[activeCategory];

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".menu-entry, .sauce-circle"));
    targets.forEach((element, index) => {
      element.classList.add("reveal-on-scroll");
      element.style.setProperty("--reveal-delay", `${Math.min(index * 35, 240)}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [activeCategory]);

  return (
    <main className="menu-page">
      <header className="menu-page-header page-shell">
        <a className="brand-lockup" href="/" aria-label="WingOver home"><Image src="/images/wingover-logo.png" alt="WingOver" width={210} height={80} priority /></a>
        <nav className="menu-page-nav" aria-label="Menu navigation"><a href="/">Home</a><a href="/#story">Our story</a><a href="/#come-through">Come through</a></nav>
        <h1 className="visually-hidden">WingOver menu</h1>
      </header>

      <section className="menu-list-section" id="menu-list">
        <div className="page-shell menu-directory">
          <div className="menu-page-tabs" role="tablist" aria-label="Menu categories">
            <span className="menu-tabs-label">Choose a category</span>
            {menuCategories.map((category) => (
              <button
                key={category.label}
                id={`menu-tab-${category.label.toLowerCase()}`}
                role="tab"
                type="button"
                aria-controls="menu-panel"
                aria-selected={activeCategory === category.label}
                className={activeCategory === category.label ? "menu-page-tab active" : "menu-page-tab"}
                onClick={() => setActiveCategory(category.label)}
              >
                <span className="menu-tab-number">{category.number}</span>
                <span>{category.label}</span>
                <span className="menu-tab-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>

          <div className="menu-directory-content" id="menu-panel" role="tabpanel" aria-labelledby={`menu-tab-${activeCategory.toLowerCase()}`}>
            {activeCategory === "Sauces" ? (
              <div className="all-sauces-view">
                <div className="menu-page-items-heading">
                  <div><p className="menu-category-kicker">{sauceCircles.length} flavors</p><h2>Sauces<em>.</em></h2></div>
                </div>
                <p className="sauce-menu-intro">Find your flavor, then put it on everything.</p>
                <div className="sauce-circle-grid">
                  {sauceCircles.map(([name, image], index) => (
                    <figure className="sauce-circle" key={name} style={{ "--circle-delay": `${index * 15}ms` } as React.CSSProperties}>
                      <span className="sauce-circle-image"><Image src={image} alt="" fill sizes="(max-width: 600px) 44vw, 170px" /></span>
                      <figcaption><span className="sauce-circle-label">{name}</span><span className="sauce-circle-number">{String(index + 1).padStart(2, "0")}</span></figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ) : (
              <div className="menu-page-items">
                <div className="menu-page-items-heading">
                  <div><p className="menu-category-kicker">{items.length} items</p><h2>{activeCategory}<em>.</em></h2></div>
                </div>
                <div className="menu-item-list">
                  {items.map((item, index) => (
                    <article className="menu-entry" key={item.name}>
                      <span className="menu-entry-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      <div className="menu-entry-photo"><Image src={item.image} alt={item.name} fill sizes="(max-width: 800px) 90px, 120px" /></div>
                      <div className="menu-entry-details">
                        <div className="menu-entry-titleline"><h3>{item.name}</h3><span>{item.tag}</span></div>
                        <p className="menu-entry-ingredients"><span>Inside</span>{item.ingredients?.join(" · ") ?? item.description}</p>
                      </div>
                      <strong className="menu-entry-price">{item.price}</strong>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="menu-page-footer"><div className="page-shell"><span>WingOver · Made for the craving</span><a href="/">Back to home ↑</a></div></footer>
    </main>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { featuredItems, heatScaleLevels, homeCategories, sauceCards, type HomeCategory } from "@/lib/menu-data";

const carouselSauces = [...sauceCards, ...sauceCards, ...sauceCards];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<HomeCategory>("Featured");
  const [activeHeatIndex, setActiveHeatIndex] = useState(0);
  const [activeSaucePosition, setActiveSaucePosition] = useState(sauceCards.length);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const sauceTrackRef = useRef<HTMLDivElement>(null);
  const items = featuredItems[activeCategory];
  const activeHeatLevel = heatScaleLevels[activeHeatIndex];
  const activeSauceIndex = activeSaucePosition % sauceCards.length;

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncVideoPlayback = () => {
      const video = heroVideoRef.current;
      if (!video) return;
      if (motionPreference.matches) video.pause();
      else void video.play().catch(() => {});
    };

    syncVideoPlayback();
    motionPreference.addEventListener("change", syncVideoPlayback);
    return () => motionPreference.removeEventListener("change", syncVideoPlayback);
  }, []);

  const scrollSauce = (direction: number) => {
    const track = sauceTrackRef.current;
    if (!track) return;

    const carouselItems = Array.from(track.querySelectorAll<HTMLElement>(".sauce-carousel-item"));
    const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
    const currentItem = carouselItems.reduce((current, item) => {
      const itemCenter = item.getBoundingClientRect().left + item.offsetWidth / 2;
      const currentCenter = current.getBoundingClientRect().left + current.offsetWidth / 2;
      return Math.abs(itemCenter - trackCenter) < Math.abs(currentCenter - trackCenter) ? item : current;
    });
    const currentPosition = Number(currentItem.getAttribute("data-index"));
    const targetPosition = currentPosition + direction;
    const wrappedPosition = sauceCards.length + ((targetPosition % sauceCards.length) + sauceCards.length) % sauceCards.length;
    const nextItem = carouselItems[targetPosition] ?? carouselItems[wrappedPosition];
    nextItem?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".menu-section, .heat-scale-section, .story-section, .sauce-section, .come-through-section, .menu-card, .sauce-circle"));
    targets.forEach((element, index) => {
      element.classList.add("reveal-on-scroll");
      element.style.setProperty("--reveal-delay", `${Math.min(index * 45, 260)}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = sauceTrackRef.current;
    if (!track) return;

    const sauceItems = Array.from(track.querySelectorAll<HTMLElement>(".sauce-carousel-item"));
    const copyWidth = sauceItems[sauceCards.length].offsetLeft - sauceItems[0].offsetLeft;
    const middleFirstItem = sauceItems[sauceCards.length];
    track.scrollLeft = middleFirstItem.offsetLeft - (track.clientWidth - middleFirstItem.offsetWidth) / 2;
    let normalizeTimer: number | null = null;

    const closestItem = () => {
      const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
      return sauceItems.reduce((current, item) => {
        const itemCenter = item.getBoundingClientRect().left + item.offsetWidth / 2;
        const currentCenter = current.getBoundingClientRect().left + current.offsetWidth / 2;
        return Math.abs(itemCenter - trackCenter) < Math.abs(currentCenter - trackCenter) ? item : current;
      });
    };

    const updateActiveSauce = () => {
      setActiveSaucePosition(Number(closestItem().getAttribute("data-index")));

      if (normalizeTimer !== null) window.clearTimeout(normalizeTimer);
      normalizeTimer = window.setTimeout(() => {
        if (track.scrollLeft < copyWidth * 0.5) track.scrollLeft += copyWidth;
        if (track.scrollLeft > copyWidth * 1.5) track.scrollLeft -= copyWidth;
        setActiveSaucePosition(Number(closestItem().getAttribute("data-index")));
      }, 140);
    };

    updateActiveSauce();
    track.addEventListener("scroll", updateActiveSauce, { passive: true });
    window.addEventListener("resize", updateActiveSauce);
    return () => {
      if (normalizeTimer !== null) window.clearTimeout(normalizeTimer);
      track.removeEventListener("scroll", updateActiveSauce);
      window.removeEventListener("resize", updateActiveSauce);
    };
  }, []);

  return (
    <main>
      <div className="announcement">
        <span>Crispy wings. Stacked sandwiches.</span>
        <a href="/menu">Explore the menu <span aria-hidden="true">↗</span></a>
      </div>

      <section className="hero" id="top">
        <video ref={heroVideoRef} className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/images/hero-sandwich.jpg" aria-hidden="true">
          <source src="/videos/hero-sequence.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <header className="site-header">
          <a className="brand-lockup" href="#top" aria-label="WingOver home">
            <Image src="/images/wingover-logo.png" alt="WingOver" width={210} height={80} priority />
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/menu">Menu</a>
            <a href="#story">Our story</a>
            <a href="#sauces">Sauces</a>
            <a href="#come-through">Come through</a>
          </nav>
          <a className="header-order" href="/menu">Order now <span aria-hidden="true">↗</span></a>
        </header>

        <div className="hero-content page-shell">
          <div className="hero-copy">
            <h1>Crispy.<br /><em>Saucy.</em><br />WingOver.</h1>
            <p className="hero-description">Crispy wings, stacked sandwiches, and sauces with something to say.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="/menu">Start your order <span aria-hidden="true">↗</span></a>
              <a className="button button-ghost" href="/menu">See the full menu <span aria-hidden="true">↓</span></a>
            </div>
          </div>
        </div>

        <div className="hero-bottom page-shell">
          <span className="scroll-note"><span className="scroll-line" /> Scroll to get saucy</span>
        </div>
      </section>

      <section className="menu-section page-shell" id="menu">
        <div className="section-heading">
          <div>
            <h2>Pick your<br /><em>pleasure.</em></h2>
          </div>
        </div>

        <div className="menu-tabs" role="tablist" aria-label="Featured menu categories">
          {homeCategories.map((category) => (
            <button key={category.label} role="tab" aria-selected={activeCategory === category.label} onClick={() => setActiveCategory(category.label)} className={activeCategory === category.label ? "menu-tab active" : "menu-tab"}>
              {category.label}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {items.map((item) => (
            <a className="menu-card" href="/menu" key={item.name} aria-label={`Explore ${item.name} on the full menu`}>
              <span className="menu-card-visual"><Image src={item.image} alt="" fill sizes="(max-width: 800px) 82vw, 33vw" /></span>
              <span className="menu-card-content"><strong>{item.name}</strong><span>{item.price}</span></span>
            </a>
          ))}
        </div>
        <a className="text-link" href="/menu">View all menu items <span aria-hidden="true">↗</span></a>
      </section>

      <section className="heat-scale-section" aria-labelledby="heat-scale-heading">
        <div className="page-shell">
          <div className="heat-scale-heading">
            <p className="eyebrow dark"><span className="eyebrow-dot" /> THE HEAT SCALE</p>
            <h2 id="heat-scale-heading">Find your <em>heat.</em></h2>
          </div>
          <div className="heat-scale-control">
            <div className="heat-scale-rail">
              <span className="heat-scale-rail-line" aria-hidden="true" />
              <input
                type="range"
                min="0"
                max={heatScaleLevels.length - 1}
                step="1"
                value={activeHeatIndex}
                onChange={(event) => setActiveHeatIndex(Number(event.target.value))}
                aria-label="Choose a sauce heat level"
                aria-valuetext={activeHeatLevel.label}
              />
              <span className="heat-scale-fire" style={{ left: `${activeHeatIndex * 50}%` }} aria-hidden="true">
                <svg viewBox="0 0 48 56" focusable="false"><path d="M25 2c2 9-5 13-4 20 6-3 10-9 11-14 9 8 13 18 13 27 0 13-9 21-21 21S3 48 3 35c0-11 8-19 14-24-1 7 2 12 4 14-1-8 5-14 4-23Z" fill="currentColor" stroke="#0a0a0a" strokeWidth="2" /><path d="M25 29c6 6 7 9 7 14 0 5-3 9-8 9s-9-4-9-9c0-5 3-9 7-12 0 4 1 6 3 8 1-3 0-6 0-10Z" fill="#f5f0e7" /></svg>
              </span>
            </div>
            <div className="heat-scale-stops">
              {heatScaleLevels.map((level, index) => (
                <button type="button" key={level.label} className={index === activeHeatIndex ? "heat-scale-stop active" : "heat-scale-stop"} aria-pressed={index === activeHeatIndex} onClick={() => setActiveHeatIndex(index)}>{level.label}</button>
              ))}
            </div>
          </div>
          <div className="heat-scale-results">
            <div className="heat-scale-result-heading" aria-live="polite">
              <h3>{activeHeatLevel.label}</h3><span>{activeHeatLevel.range}</span>
            </div>
            <div className="heat-scale-sauces" key={activeHeatLevel.label}>
              {activeHeatLevel.sauces.map((sauce) => (
                <figure className="heat-scale-sauce" key={sauce.name}>
                  <span className="heat-scale-sauce-image"><Image src={sauce.image} alt="" fill sizes="(max-width: 800px) 110px, 124px" /></span>
                  <figcaption>{sauce.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="story-section" id="story">
        <div className="story-media-grid">
          <div className="story-media-card story-media-motion">
            <Image className="story-motion-gif" src="/images/bring-the-heat-motion-1024.gif" alt="WingOver Feel the Heat animated artwork" fill unoptimized sizes="(max-width: 800px) 58vw, 42vw" />
            <Image className="story-motion-still" src="/images/heat-motion-still-1024.png" alt="WingOver Feel the Heat artwork" fill sizes="(max-width: 800px) 58vw, 42vw" />
          </div>
          <div className="story-media-card story-media-feast">
            <Image src="/images/crispy-chicken-feast.png" alt="WingOver chicken sandwiches, fries, and drink on a red background" fill sizes="(max-width: 800px) 100vw, 67vw" />
          </div>
        </div>
      </section>

      <section className="sauce-section page-shell" id="sauces">
        <div className="section-heading sauce-heading">
          <div>
            <p className="eyebrow dark"><span className="eyebrow-dot" /> SAUCE IT UP</p>
            <h2>Choose your<br /><em>chaos.</em></h2>
          </div>
        </div>
        <div className="sauce-carousel-toolbar">
          <span className="sauce-carousel-status">{String(activeSauceIndex + 1).padStart(2, "0")} / {String(sauceCards.length).padStart(2, "0")} sauces</span>
          <div className="sauce-carousel-controls" aria-label="Sauce carousel controls">
            <button className="sauce-carousel-control" type="button" aria-label="Previous sauce" onClick={() => scrollSauce(-1)}>←</button>
            <button className="sauce-carousel-control" type="button" aria-label="Next sauce" onClick={() => scrollSauce(1)}>→</button>
          </div>
        </div>
        <div className="sauce-carousel" ref={sauceTrackRef} aria-label="WingOver sauces">
          <div className="sauce-carousel-track">
            {carouselSauces.map((sauce, index) => (
              <a className={`sauce-circle sauce-carousel-item ${activeSaucePosition === index ? "is-active" : index < activeSaucePosition ? "is-left" : "is-right"}`} data-index={index} key={`${sauce.name}-${index}`} href="/menu" style={{ "--circle-delay": `${(index % sauceCards.length) * 80}ms` } as React.CSSProperties}>
                <span className="sauce-circle-image"><Image src={sauce.image} alt={sauce.name} fill sizes="(max-width: 700px) 210px, 255px" /></span>
                <span className="sauce-circle-label">{sauce.name}</span>
                <span className="sauce-circle-number">{sauce.heat} • {sauce.note}</span>
              </a>
            ))}
          </div>
        </div>
        <a className="text-link sauce-view-all" href="/menu">See all sauces <span aria-hidden="true">↗</span></a>
      </section>

      <section className="come-through-section" id="come-through" aria-labelledby="come-through-heading">
        <div className="page-shell come-through-inner">
          <div className="come-through-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> COME THROUGH</p>
            <h2 id="come-through-heading">Come<br /><em>hungry.</em></h2>
            <a className="come-through-link" href="/menu">Explore the menu <span aria-hidden="true">↗</span></a>
          </div>
          <div className="come-through-visual" aria-hidden="true">
            <Image src="/images/cutouts/wings-sauced.png" alt="" fill sizes="(max-width: 800px) 90vw, 48vw" />
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-shell footer-top"><Image src="/images/wingover-logo.png" alt="WingOver" width={250} height={95} /><p>Built for<br />the craving.</p><div className="footer-links"><a href="/menu">Menu</a><a href="#story">Our story</a><a href="#sauces">Sauces</a><a href="#come-through">Come through</a></div></div>
        <div className="page-shell footer-bottom"><span>© 2025 WingOver</span><span>Made for the craving <span className="footer-heart">♥</span></span><a href="#top">Back to top ↑</a></div>
      </footer>

      <a className="mobile-order" href="/menu">Start your order <span aria-hidden="true">↗</span></a>
    </main>
  );
}

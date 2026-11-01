import { useState } from "react";
import PostCard from "./PostCard.jsx";
import { posts, categories } from "./posts.js";
import { Sparkle, Coin, Blob } from "../components/Decor.jsx";

const ALL = "הכל";

export default function BlogIndex() {
  const [category, setCategory] = useState(ALL);
  const visible = category === ALL ? posts : posts.filter((post) => post.category === category);
  const [featured, ...rest] = visible;

  return (
    <>
      <section className="blog-hero">
        <Blob className="blog-hero__blob" />
        <Sparkle className="blog-hero__spark-1" size={30} delay={0.5} />
        <Sparkle className="blog-hero__spark-2" size={20} color="#FF6B4A" delay={0.8} />
        <Coin size={46} className="blog-hero__coin" duration={4.5} />
        <div className="container center blog-hero__inner">
          <span className="section-tag">הבלוג של CTR media</span>
          <h1 className="section-title">
            תובנות מהשטח על
            <br />
            <span className="grad-text">פרסום שמרוויח</span>
          </h1>
          <p className="section-sub">
            מאמרים על Google Ads, Meta ומדידה, מתוך מעל 13 שנות ניהול קמפיינים. בלי סיסמאות, רק מה שבאמת משנה את
            התוצאות.
          </p>
        </div>
      </section>

      <section className="blog-list">
        <div className="container">
          {categories.length > 1 && (
            <div className="blog-filter" role="group" aria-label="סינון לפי קטגוריה">
              {[ALL, ...categories].map((name) => (
                <button
                  key={name}
                  type="button"
                  className="blog-filter__btn"
                  aria-pressed={category === name}
                  onClick={() => setCategory(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          <PostCard key={featured.slug} post={featured} featured />
          {rest.length > 0 && (
            <div className="blog-grid">
              {rest.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

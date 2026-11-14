import Reveal from './Reveal';

export default function Partners({ partners }) {
  return (
    <Reveal className="wrap partners">
      {partners.line && <p>{partners.line}</p>}
      <ul className="plogos">
        {(partners.logos || []).map((p) => (
          <li key={p.alt}>
            <img src={p.image} alt={p.alt} loading="lazy" />
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

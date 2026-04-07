export default function ErrorPage() {
  return (
    <div>
      <h1>Error</h1>
      <p>Une erreur s'est produite. Veuillez réessayer plus tard.</p>
      <button onClick={() => window.location.reload()}>
        Recharger la page
      </button>
      <Link href="/">Retour à l'accueil</Link>
    </div>
  );
}

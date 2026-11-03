export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/profile",
      permanent: false,
    },
  };
}

export default function Paycheck() {
  return null;
}

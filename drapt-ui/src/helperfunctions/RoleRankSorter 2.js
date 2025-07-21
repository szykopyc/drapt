export default function RoleRankSorter(memberArray) {
  if (!Array.isArray(memberArray) || memberArray.length === 0) return [];

  const roleOrder = {
    developer: 0,
    director: 1,
    vd: 2,
    pm: 3,
    senioranalyst: 4,
    analyst: 5
  };

  return memberArray.slice().sort((a, b) => {
    return (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99);
  });
}

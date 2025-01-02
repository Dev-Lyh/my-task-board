export default function statusOrder(status: string) {
  switch (status) {
    case 'IN_PROGRESS':
      return 1;
    case 'COMPLETED':
      return 2;
    case 'WONT_DO':
      return 3;
    case 'NONE':
      return 4;
    default:
      return 99; // Ordem indefinida
  }
}

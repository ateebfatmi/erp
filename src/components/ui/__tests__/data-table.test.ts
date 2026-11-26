import { describe, it, expect } from 'vitest';

describe('DataTable Logic Suite', () => {
  interface SampleItem {
    id: string;
    name: string;
    role: string;
    salary: number;
  }

  const sampleData: SampleItem[] = [
    { id: '1', name: 'Dr. Ramesh Sharma', role: 'Head of Department', salary: 65000 },
    { id: '2', name: 'Sunita Rao', role: 'TGT Mathematics', salary: 48000 },
    { id: '3', name: 'Vikramaditya Singh', role: 'PGT History', salary: 52000 },
    { id: '4', name: 'Ananya Sen', role: 'TGT Science', salary: 45000 },
    { id: '5', name: 'Kavita Joshi', role: 'Primary Teacher', salary: 38000 },
  ];

  it('filters data by search term across fields', () => {
    const query = 'sharma';
    const filtered = sampleData.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Dr. Ramesh Sharma');
  });

  it('filters data by partial match in role', () => {
    const query = 'tgt';
    const filtered = sampleData.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    );
    expect(filtered).toHaveLength(2);
    expect(filtered.map((r) => r.name)).toEqual(['Sunita Rao', 'Ananya Sen']);
  });

  it('sorts numeric columns ascending and descending', () => {
    const sortedAsc = [...sampleData].sort((a, b) => a.salary - b.salary);
    expect(sortedAsc[0].salary).toBe(38000);
    expect(sortedAsc[sortedAsc.length - 1].salary).toBe(65000);

    const sortedDesc = [...sampleData].sort((a, b) => b.salary - a.salary);
    expect(sortedDesc[0].salary).toBe(65000);
    expect(sortedDesc[sortedDesc.length - 1].salary).toBe(38000);
  });

  it('sorts string columns alphabetically', () => {
    const sortedNames = [...sampleData].sort((a, b) => a.name.localeCompare(b.name));
    expect(sortedNames[0].name).toBe('Ananya Sen');
    expect(sortedNames[sortedNames.length - 1].name).toBe('Vikramaditya Singh');
  });

  it('paginates data slice correctly', () => {
    const pageSize = 2;
    const page1 = sampleData.slice(0, 2);
    const page2 = sampleData.slice(2, 4);
    const page3 = sampleData.slice(4, 6);

    expect(page1).toHaveLength(2);
    expect(page2).toHaveLength(2);
    expect(page3).toHaveLength(1);
    expect(page3[0].name).toBe('Kavita Joshi');
  });

  it('handles multi-row selection toggle', () => {
    let selectedKeys: string[] = [];

    const toggle = (id: string) => {
      if (selectedKeys.includes(id)) {
        selectedKeys = selectedKeys.filter((k) => k !== id);
      } else {
        selectedKeys = [...selectedKeys, id];
      }
    };

    toggle('1');
    toggle('3');
    expect(selectedKeys).toEqual(['1', '3']);

    toggle('1');
    expect(selectedKeys).toEqual(['3']);
  });
});

'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Layers,
  BookOpen,
  Trophy,
  Building,
  Plus,
  CheckCircle2,
  Users,
  DoorOpen,
  Settings,
  Sparkles,
} from 'lucide-react';
import { SubTabBar, SubTabItem } from '@/components/ui/sub-tab-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';

export type AcademicSetupTabId = 'classes' | 'subjects' | 'houses' | 'rooms';

export interface ClassSectionRecord {
  id: string;
  className: string;
  sectionName: string;
  capacity: number;
  enrolled: number;
  classTeacher: string;
  roomNumber: string;
}

export interface SubjectRecord {
  id: string;
  subjectCode: string;
  subjectName: string;
  department: string;
  theoryMaxMarks: number;
  practicalMaxMarks: number;
  passingPercent: number;
}

export interface HouseRecord {
  id: string;
  houseName: string;
  colorName: string;
  colorHex: string;
  motto: string;
  houseMaster: string;
  studentCount: number;
  championshipPoints: number;
}

export interface RoomRecord {
  id: string;
  roomNumber: string;
  roomType: 'Classroom' | 'Science Lab' | 'Computer Lab' | 'Auditorium' | 'Library';
  buildingWing: string;
  seatingCapacity: number;
  hasSmartBoard: boolean;
}

interface UnifiedAcademicSetupHubProps {
  initialTab?: AcademicSetupTabId;
}

export function UnifiedAcademicSetupHub({ initialTab = 'classes' }: UnifiedAcademicSetupHubProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // 1. Classes & Sections
  const [classSections] = useState<ClassSectionRecord[]>([
    {
      id: 'cs-1',
      className: 'Class 10',
      sectionName: 'Section A',
      capacity: 40,
      enrolled: 38,
      classTeacher: 'Dr. Ramesh Sharma (PGT Physics)',
      roomNumber: 'Room 201',
    },
    {
      id: 'cs-2',
      className: 'Class 10',
      sectionName: 'Section B',
      capacity: 40,
      enrolled: 39,
      classTeacher: 'Sunita Rao (TGT Math)',
      roomNumber: 'Room 202',
    },
    {
      id: 'cs-3',
      className: 'Class 9',
      sectionName: 'Section A',
      capacity: 40,
      enrolled: 40,
      classTeacher: 'Vikramaditya Singh (PGT History)',
      roomNumber: 'Room 101',
    },
    {
      id: 'cs-4',
      className: 'Class 11',
      sectionName: 'Science',
      capacity: 45,
      enrolled: 42,
      classTeacher: 'Dr. Debashis Mukherjee (PGT Chemistry)',
      roomNumber: 'Room 301',
    },
    {
      id: 'cs-5',
      className: 'Class 12',
      sectionName: 'Commerce',
      capacity: 45,
      enrolled: 36,
      classTeacher: 'Ananya Sen (PGT Economics)',
      roomNumber: 'Room 302',
    },
  ]);

  // 2. Subjects Master
  const [subjects] = useState<SubjectRecord[]>([
    {
      id: 'sub-1',
      subjectCode: '041',
      subjectName: 'Mathematics Standard',
      department: 'Mathematics',
      theoryMaxMarks: 80,
      practicalMaxMarks: 20,
      passingPercent: 33,
    },
    {
      id: 'sub-2',
      subjectCode: '086',
      subjectName: 'Science & Lab Practices',
      department: 'Science',
      theoryMaxMarks: 80,
      practicalMaxMarks: 20,
      passingPercent: 33,
    },
    {
      id: 'sub-3',
      subjectCode: '087',
      subjectName: 'Social Science',
      department: 'Humanities',
      theoryMaxMarks: 80,
      practicalMaxMarks: 20,
      passingPercent: 33,
    },
    {
      id: 'sub-4',
      subjectCode: '101',
      subjectName: 'English Communicative',
      department: 'Languages',
      theoryMaxMarks: 80,
      practicalMaxMarks: 20,
      passingPercent: 33,
    },
    {
      id: 'sub-5',
      subjectCode: '402',
      subjectName: 'Information Technology',
      department: 'Computer Science',
      theoryMaxMarks: 50,
      practicalMaxMarks: 50,
      passingPercent: 33,
    },
  ]);

  // 3. Houses Master
  const [houses] = useState<HouseRecord[]>([
    {
      id: 'h-1',
      houseName: 'Shivaji House',
      colorName: 'Royal Red',
      colorHex: '#dc2626',
      motto: 'Courage & Valor in Service',
      houseMaster: 'Balwant Singh (PE Director)',
      studentCount: 312,
      championshipPoints: 480,
    },
    {
      id: 'h-2',
      houseName: 'Tagore House',
      colorName: 'Ocean Blue',
      colorHex: '#2563eb',
      motto: 'Where the Mind is Without Fear',
      houseMaster: 'Mrs. Rekha Pathak',
      studentCount: 308,
      championshipPoints: 510,
    },
    {
      id: 'h-3',
      houseName: 'Ashoka House',
      colorName: 'Emerald Green',
      colorHex: '#059669',
      motto: 'Triumph Through Righteous Action',
      houseMaster: 'Er. Sandeep Mittal',
      studentCount: 315,
      championshipPoints: 445,
    },
    {
      id: 'h-4',
      houseName: 'Raman House',
      colorName: 'Golden Yellow',
      colorHex: '#d97706',
      motto: 'Quest for Truth & Innovation',
      houseMaster: 'Dr. Ramesh Sharma',
      studentCount: 305,
      championshipPoints: 495,
    },
  ]);

  // 4. Rooms Master
  const [rooms] = useState<RoomRecord[]>([
    {
      id: 'r-1',
      roomNumber: 'Room 201',
      roomType: 'Classroom',
      buildingWing: 'North Academic Wing',
      seatingCapacity: 45,
      hasSmartBoard: true,
    },
    {
      id: 'r-2',
      roomNumber: 'Room 202',
      roomType: 'Classroom',
      buildingWing: 'North Academic Wing',
      seatingCapacity: 45,
      hasSmartBoard: true,
    },
    {
      id: 'r-3',
      roomNumber: 'Science Lab 2',
      roomType: 'Science Lab',
      buildingWing: 'Science Complex',
      seatingCapacity: 35,
      hasSmartBoard: true,
    },
    {
      id: 'r-4',
      roomNumber: 'Auditorium Hall',
      roomType: 'Auditorium',
      buildingWing: 'Cultural Block',
      seatingCapacity: 600,
      hasSmartBoard: true,
    },
  ]);

  const tabs: SubTabItem[] = [
    {
      id: 'classes',
      label: 'Classes & Section Capacities',
      icon: GraduationCap,
      badge: `${classSections.length} Sections`,
    },
    {
      id: 'subjects',
      label: 'Curriculum & Subject Codes',
      icon: BookOpen,
      badge: 'CBSE Codes',
    },
    {
      id: 'houses',
      label: 'Institutional House System',
      icon: Trophy,
      badge: '4 Houses',
    },
    {
      id: 'rooms',
      label: 'Rooms & Infrastructure',
      icon: DoorOpen,
      badge: 'Smart Class',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="h-6 w-6 text-blue-600" />
              Academic Setup, Class Architecture &amp; Master Catalogs
            </h1>
            <Badge variant="indigo" className="text-[11px] font-semibold py-0.5">
              Institutional Master Data
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Configure permanent academic building blocks: class grades, section capacity quotas, assigned class teachers,
            CBSE subject syllabus allocations, institutional house system leadership, and classroom infrastructure.
          </p>
        </div>
      </div>

      {/* Unified Tab Strip */}
      <SubTabBar
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm"
      />

      {/* Tab 1: Classes & Sections */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <DataTable
            data={classSections}
            columns={[
              {
                key: 'className',
                header: 'Standard & Section',
                sortable: true,
                render: (row) => (
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{row.className} — {row.sectionName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Location: {row.roomNumber}</span>
                  </div>
                ),
              },
              {
                key: 'classTeacher',
                header: 'Class Teacher',
                sortable: true,
                render: (row) => <span className="text-xs font-medium text-slate-800">{row.classTeacher}</span>,
              },
              {
                key: 'capacity',
                header: 'Enrolled / Quota',
                render: (row) => (
                  <div className="w-32 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                      <span>{row.enrolled} / {row.capacity}</span>
                      <span className="font-bold">{Math.round((row.enrolled / row.capacity) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${(row.enrolled / row.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Seat Status',
                align: 'center',
                render: (row) =>
                  row.enrolled >= row.capacity ? (
                    <Badge variant="warning" className="text-[10px]">At Capacity</Badge>
                  ) : (
                    <Badge variant="success" className="text-[10px]">{row.capacity - row.enrolled} Seats Open</Badge>
                  ),
              },
            ]}
            rowKey="id"
            exportCsvFilename="class_section_masters"
          />
        </div>
      )}

      {/* Tab 2: Curriculum Subjects */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <DataTable
            data={subjects}
            columns={[
              {
                key: 'subjectCode',
                header: 'CBSE Code',
                sortable: true,
                render: (row) => <span className="font-mono font-bold text-xs text-blue-600">#{row.subjectCode}</span>,
              },
              {
                key: 'subjectName',
                header: 'Subject Title',
                sortable: true,
                render: (row) => (
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{row.subjectName}</span>
                    <span className="text-[10px] text-slate-500">{row.department}</span>
                  </div>
                ),
              },
              {
                key: 'theoryMaxMarks',
                header: 'Theory / Practical',
                render: (row) => (
                  <span className="font-mono text-xs text-slate-700">
                    Theory: {row.theoryMaxMarks} &bull; Practical: {row.practicalMaxMarks}
                  </span>
                ),
              },
              {
                key: 'passingPercent',
                header: 'Passing Threshold',
                align: 'center',
                render: (row) => <Badge variant="outline" className="font-mono text-xs">{row.passingPercent}%</Badge>,
              },
            ]}
            rowKey="id"
            exportCsvFilename="curriculum_subjects_master"
          />
        </div>
      )}

      {/* Tab 3: Institutional Houses */}
      {activeTab === 'houses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {houses.map((house) => (
            <Card key={house.id} className="border-slate-200 shadow-xs">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3.5 w-3.5 rounded-full ring-2 ring-slate-100"
                    style={{ backgroundColor: house.colorHex }}
                  />
                  <CardTitle className="text-sm font-bold text-slate-900">
                    {house.houseName}
                  </CardTitle>
                </div>
                <Badge variant="indigo" className="text-xs font-mono font-bold">
                  {house.championshipPoints} Pts
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2 pt-2 text-xs">
                <p className="text-slate-500 italic">&ldquo;{house.motto}&rdquo;</p>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                  <div><strong>House Master:</strong> {house.houseMaster}</div>
                  <div><strong>Total Students Assigned:</strong> {house.studentCount}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 4: Rooms Master */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <DataTable
            data={rooms}
            columns={[
              {
                key: 'roomNumber',
                header: 'Room # / Facility',
                sortable: true,
                render: (row) => <span className="font-bold text-slate-900 text-xs">{row.roomNumber}</span>,
              },
              {
                key: 'roomType',
                header: 'Room Classification',
                render: (row) => <Badge variant="secondary" className="text-[10px]">{row.roomType}</Badge>,
              },
              { key: 'buildingWing', header: 'Location / Wing', render: (row) => <span className="text-xs text-slate-600">{row.buildingWing}</span> },
              {
                key: 'seatingCapacity',
                header: 'Capacity',
                align: 'center',
                render: (row) => <span className="font-mono text-xs font-bold text-slate-800">{row.seatingCapacity} seats</span>,
              },
              {
                key: 'hasSmartBoard',
                header: 'Smart Class Tech',
                align: 'center',
                render: (row) =>
                  row.hasSmartBoard ? (
                    <Badge variant="success" className="text-[10px] gap-1">
                      <Sparkles className="h-3 w-3" /> Interactive Board
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">Standard Board</Badge>
                  ),
              },
            ]}
            rowKey="id"
            exportCsvFilename="campus_rooms_master"
          />
        </div>
      )}
    </div>
  );
}

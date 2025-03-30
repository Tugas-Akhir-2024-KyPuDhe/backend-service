const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const {
  dataConfigSchool,
  customStudents,
  dataMajor,
  dataStaff,
  dataCourse,
  dataDeveloper,
} = require("./data");

const prisma = new PrismaClient();

async function main() {
  // #region | Seeder untuk data sekolah
  (await prisma.configSchool.count({})) < 1 &&
    (await prisma.configSchool.create({
      data: dataConfigSchool,
    }));

  console.log("Seeding config school completed.");
  //#endregion

  // #region | Seeder Major
  for (const major of dataMajor) {
    await prisma.major.create({
      data: major,
    });
  }
  console.log("Seeding major completed.");

  // #region | Seeder Course
  for (const course of dataCourse) {
    await prisma.course.create({
      data: course,
    });
  }
  console.log("Seeding course completed.");

  const defaultPassword = await bcrypt.hash("12345678", 10);
  const startYear = new Date("2024-07-01");
  // #region | Seeder Students
  // const majors = ["TKJ", "MM", "RPL", "TITL"];

  // function formatBirthPlace(city, birthDate) {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   const formattedDate = birthDate.toLocaleDateString("id-ID", options);
  //   return `${city}, ${formattedDate}`; // Contoh: "Medan, 15 Juni 2005"
  // }
  // // Generate birth date
  // const birthDate = new Date(
  //   2004 + Math.floor(Math.random() * 3), // Year: Random between 2004-2006
  //   Math.floor(Math.random() * 12), // Month: Random between 0-11
  //   Math.floor(Math.random() * 28) + 1 // Day: Random between 1-28
  // );

  // Insert custom students
  for (const student of customStudents) {
    const user = await prisma.user.create({
      data: {
        username: `${student.nis}`,
        password: defaultPassword,
        roles: {
          create: { name: "STUDENT" },
        },
        students: {
          create: {
            name: student.name,
            nis: student.nis,
            nisn: student.nisn,
            majorCode: student.majorCode,
            birthPlace: student.birthPlace,
            address: student.address,
            phone: student.phone,
            email: student.email,
            gender: student.gender,
            startYear,
          },
        },
      },
    });
  }
  console.log("Seeding custom students completed.");

  // const nisSet = new Set(customStudents.map((s) => s.nis));
  // const nisnSet = new Set(customStudents.map((s) => s.nisn));

  // for (const major of majors) {
  //   for (let i = 1; i <= 10; i++) {
  //     let nis, nisn;

  //     do {
  //       nis = `${Math.floor(100000 + Math.random() * 900000)}`;
  //     } while (nisSet.has(nis));
  //     nisSet.add(nis);

  //     do {
  //       nisn = `${Math.floor(100000 + Math.random() * 900000)}`;
  //     } while (nisnSet.has(nisn));
  //     nisnSet.add(nisn);

  //     const studentName = `Siswa ${i}`;

  //     await prisma.user.create({
  //       data: {
  //         username: `${nis}`,
  //         password: defaultPassword,
  //         roles: {
  //           create: { name: "STUDENT" },
  //         },
  //         students: {
  //           create: {
  //             name: studentName,
  //             nis,
  //             nisn,
  //             majorCode: major,
  //             birthPlace: formatBirthPlace("Kota A", birthDate),
  //             address: `Alamat ${i}, ${major}`,
  //             phone: `081234567${i}`,
  //             email: `student${i}@example.com`,
  //             gender: i % 2 === 0 ? "P" : "L",
  //             startYear,
  //           },
  //         },
  //       },
  //     });
  //   }
  //   console.log(`Seeding students for major: ${major} completed.`);
  // }
  // #endregion

  //#regon | Seeder Developer
  const developerCount = await prisma.staff.count({});
  if (developerCount < 1) {
    const hashedPassword = await bcrypt.hash("12345678", 10);

    await prisma.user.create({
      data: {
        username: dataDeveloper.nip,
        password: hashedPassword,
        roles: {
          create: {
            name: dataDeveloper.role,
          },
        },
        staff: {
          create: {
            name: dataDeveloper.name,
            birthPlace: dataDeveloper.birthPlace,
            address: dataDeveloper.address,
            phone: dataDeveloper.phone,
            email: dataDeveloper.email,
            gender: dataDeveloper.gender,
            mapel: dataDeveloper.mapel,
            nip: dataDeveloper.nip,
            type: dataDeveloper.type,
            position: dataDeveloper.position,
            startDate: dataDeveloper.startDate,
          },
        },
      },
    });
  }
  console.log("Seeding developer completed.");
  // #endregion

  //#regon | Seeder Staff
  for (const staff of dataStaff) {
    const hashedPassword = await bcrypt.hash("12345678", 10);

    await prisma.user.create({
      data: {
        username: staff.nip,
        password: hashedPassword,
        roles: {
          create: {
            name: staff.role,
          },
        },
        staff: {
          create: {
            name: staff.name,
            birthPlace: staff.birthPlace,
            address: staff.address,
            phone: staff.phone,
            email: staff.email,
            gender: staff.gender,
            mapel: staff.mapel,
            nip: staff.nip,
            type: staff.type,
            position: staff.position,
            startDate: staff.startDate,
          },
        },
      },
    });
  }
  console.log("Seeding staff completed.");
  // #endregion
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

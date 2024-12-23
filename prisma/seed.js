const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // #region | Seeder untuk data sekolah
  // const configSchool = {
  //   name: "SMK NEGERI 1 LUMBAN JULU",
  //   about:
  //     "SMK Negeri 1 Lumban Julu adalah institusi pendidikan kejuruan yang berfokus pada pengembangan keterampilan siswa di bidang teknologi, bisnis, dan layanan masyarakat. Kami berdedikasi untuk mencetak lulusan yang siap bersaing di dunia kerja maupun melanjutkan pendidikan ke jenjang yang lebih tinggi.",
  //   vision:
  //     "Menjadi sekolah kejuruan unggulan yang menghasilkan lulusan berkualitas, berkarakter, dan berkompeten di bidangnya untuk bersaing di era global.",
  //   mission:
  //     "1. Menyediakan pendidikan kejuruan yang berbasis teknologi dan kewirausahaan.\n2. Meningkatkan kompetensi siswa melalui pelatihan praktik kerja industri.\n3. Membentuk karakter siswa yang jujur, disiplin, dan bertanggung jawab.\n4. Mengembangkan kurikulum yang relevan dengan kebutuhan dunia kerja.\n5. Menjalin kemitraan dengan dunia usaha dan industri.",
  //   address: "Jalan Lintas Sumatera, Aeknatolu Jaya, Kecamatan Lumban Julu",
  //   telp: "+62 822-8302-0850",
  //   email: "info@smkn1lumbanjulu.sch.id",
  //   maps: '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15942.833059396076!2d99.0161061!3d2.6008913!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3031f01ad5a61e53%3A0xa1341928e9376e81!2sSMK%20Negeri%201%20Lumbanjulu!5e0!3m2!1sid!2sid!4v1731691727941!5m2!1sid!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  //   npsn: "12345678",
  //   fb: "https://facebook.com/smkn1lumbanjulu",
  //   ig: "https://instagram.com/smkn1lumbanjulu",
  //   tiktok: "https://tiktok.com/@smkn1lumbanjulu",
  // };

  // (await prisma.configSchool.count({})) < 1 &&
  //   (await prisma.configSchool.create({
  //     data: configSchool,
  //   }));

  // console.log("Seeding config school completed.");
  //#endregion

  // #region | Seeder Students
  const customStudents = [
    {
      name: "Dhea Romantika",
      nis: "223344",
      nisn: "102938",
      majorCode: "TKJ",
      birthPlace: "Medan, 24 Februari 2003",
      address: "Jl. Mawar No.1",
      phone: "081234567890",
      email: "dhea.romantika@example.com",
      gender: "P",
    },
    {
      name: "Rizky Fadillah",
      nis: "112233",
      nisn: "203948",
      majorCode: "MM",
      birthPlace: "Jakarta, 17 Desember 2002",
      address: "Jl. Melati No.2",
      phone: "081234567891",
      email: "rizky.fadillah@example.com",
      gender: "L",
    },
    {
      name: "Muhammad Syahputra",
      nis: "334455",
      nisn: "304958",
      majorCode: "RPL",
      birthPlace: "Bandung, 22 April 2003",
      address: "Jl. Kenanga No.3",
      phone: "081234567892",
      email: "muhammad.syahputra@example.com",
      gender: "L",
    },
  ];

  const defaultPassword = await bcrypt.hash("12345678", 10);
  const startYear = new Date("2024-07-01");
  const majors = ["TKJ", "MM", "RPL", "TITL"];

  function formatBirthPlace(city, birthDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = birthDate.toLocaleDateString("id-ID", options);
    return `${city}, ${formattedDate}`; // Contoh: "Medan, 15 Juni 2005"
  }
  // Generate birth date
  const birthDate = new Date(
    2004 + Math.floor(Math.random() * 3), // Year: Random between 2004-2006
    Math.floor(Math.random() * 12), // Month: Random between 0-11
    Math.floor(Math.random() * 28) + 1 // Day: Random between 1-28
  );

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
            status: "Active",
          },
        },
      },
    });
  }
  console.log("Custom students seeded.");

  // Insert default students for each major
  const nisSet = new Set(customStudents.map((s) => s.nis)); // Avoid duplicate NIS
  const nisnSet = new Set(customStudents.map((s) => s.nisn));

  for (const major of majors) {
    console.log(`Creating default students for major: ${major}`);

    for (let i = 1; i <= 10; i++) {
      let nis, nisn;

      // Generate unique 6-digit NIS
      do {
        nis = `${Math.floor(100000 + Math.random() * 900000)}`;
      } while (nisSet.has(nis));
      nisSet.add(nis);

      // Generate unique 6-digit NISN
      do {
        nisn = `${Math.floor(100000 + Math.random() * 900000)}`;
      } while (nisnSet.has(nisn));
      nisnSet.add(nisn);

      const studentName = `Siswa ${i}`;

      // Create user first, then associate student
      await prisma.user.create({
        data: {
          username: `${nis}`,
          password: defaultPassword,
          roles: {
            create: { name: "STUDENT" },
          },
          students: {
            create: {
              name: studentName,
              nis,
              nisn,
              majorCode: major,
              birthPlace: formatBirthPlace("Kota A", birthDate),
              address: `Alamat ${i}, ${major}`,
              phone: `081234567${i}`,
              email: `student${i}@example.com`,
              gender: i % 2 === 0 ? "P" : "L",
              startYear,
              status: "Active",
            },
          },
        },
      });
    }
  }
  console.log("Default students seeded.");
  // #endregion

  //#regon | Seeder Staff
  // const staff = {
  //   name: "Joko",
  //   birthPlace: "21 Juni 1961",
  //   address: "Solo",
  //   phone: "08536746398",
  //   email: "Joko@gmail.com",
  //   gender: "L",
  //   mapel: "",
  //   nip: "P001",
  //   type: "PH",
  //   position: "",
  //   startDate: new Date("2024-08-07"),
  //   role: "STAFF",
  // };

  // const staffCount = await prisma.staff.count({});
  // if (staffCount < 1) {
  //   // Membuat user baru jika belum ada staff
  //   const hashedPassword = await bcrypt.hash("12345678", 10); // Ganti dengan password yang sesuai

  //   await prisma.user.create({
  //     data: {
  //       username: staff.nip, // Menggunakan nip sebagai username
  //       password: hashedPassword, // Password yang telah di-hash
  //       roles: {
  //         create: {
  //           name: staff.role, // Menggunakan role yang ada pada data staff
  //         },
  //       },
  //       staff: {
  //         create: {
  //           name: staff.name,
  //           birthPlace: staff.birthPlace,
  //           address: staff.address,
  //           phone: staff.phone,
  //           email: staff.email,
  //           gender: staff.gender,
  //           mapel: staff.mapel,
  //           nip: staff.nip,
  //           type: staff.type,
  //           position: staff.position,
  //           startDate: staff.startDate,
  //         },
  //       },
  //     },
  //   });
  // }
  // console.log("Seeding Staff completed.");
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

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const configSchool = {
    name: "SMK NEGERI 1 LUMBAN JULU",
    about:
      "SMK Negeri 1 Lumban Julu adalah institusi pendidikan kejuruan yang berfokus pada pengembangan keterampilan siswa di bidang teknologi, bisnis, dan layanan masyarakat. Kami berdedikasi untuk mencetak lulusan yang siap bersaing di dunia kerja maupun melanjutkan pendidikan ke jenjang yang lebih tinggi.",
    vision:
      "Menjadi sekolah kejuruan unggulan yang menghasilkan lulusan berkualitas, berkarakter, dan berkompeten di bidangnya untuk bersaing di era global.",
    mission:
      "1. Menyediakan pendidikan kejuruan yang berbasis teknologi dan kewirausahaan.\n2. Meningkatkan kompetensi siswa melalui pelatihan praktik kerja industri.\n3. Membentuk karakter siswa yang jujur, disiplin, dan bertanggung jawab.\n4. Mengembangkan kurikulum yang relevan dengan kebutuhan dunia kerja.\n5. Menjalin kemitraan dengan dunia usaha dan industri.",
    address: "Jalan Lintas Sumatera, Aeknatolu Jaya, Kecamatan Lumban Julu",
    telp: "+62 822-8302-0850",
    email: "info@smkn1lumbanjulu.sch.id",
    maps: '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15942.833059396076!2d99.0161061!3d2.6008913!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3031f01ad5a61e53%3A0xa1341928e9376e81!2sSMK%20Negeri%201%20Lumbanjulu!5e0!3m2!1sid!2sid!4v1731691727941!5m2!1sid!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    npsn: "12345678",
    fb: "https://facebook.com/smkn1lumbanjulu",
    ig: "https://instagram.com/smkn1lumbanjulu",
    tiktok: "https://tiktok.com/@smkn1lumbanjulu",
  };
  

  await prisma.configSchool.create({
    data: configSchool,
  });
  console.log("Seeding config school completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

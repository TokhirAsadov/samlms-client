import React from 'react';
import styled from "styled-components";
import {mainColor} from "../../utills/ServiceUrls";

function AllContacts() {
    return (
        <Container>
            <Bodybox>
                <table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Full Name </th>
                        <th>Position</th>
                        <th>Email</th>
                        <th>Extension number</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colSpan="5" style={{background:"#f1eeee"}} className="text-center fw-bold" style={{background:"#f1eeee"}}>Ректорат</td>
                    </tr>
                        <tr>
                            <td>1</td>
                            <td>Проф. Жанполат Кудайбергенов</td>
                            <td>Ректор</td>
                            <td>j.kudaybergenov@kiut.uz</td>
                            <td>103</td>
                        </tr>

                        <tr>
                            <td>2</td>
                            <td>Проф. Джамшид Каниев</td>
                            <td>Проректор по науке и инновациям</td>
                            <td>j.kaniyev@kiut.uz</td>
                            <td>-</td>
                        </tr>

                        <tr>
                            <td>3</td>
                            <td>Проф. Каримжон Ахмеджанов</td>
                            <td>Проректор по качеству образования и международному сотрудничеству</td>
                            <td>k.akhmedjanov@kiut.uz</td>
                            <td>105</td>
                        </tr>

                        <tr>
                            <td>4</td>
                            <td>Ph.D. Шарифбай Бадалов</td>
                            <td>Менеджер по финансово-хозяйственным вопросам</td>
                            <td>sh.badalov@kiut.uz</td>
                            <td>707</td>
                        </tr>
                    <tr>
                        <td colSpan="5" style={{background:"#f1eeee"}} className="text-center fw-bold">Руководители направлений</td>
                    </tr>

                    <tr>
                        <td>1</td>
                        <td>Махаммадиев Аброр Тошкентович</td>
                        <td>Руководитель направлений "Дошкольное и начальное образование", "Специальная педагогика"</td>
                        <td>a.maxammadiyev@kiut.uz</td>
                        <td>110</td>
                    </tr>

                    <tr>
                        <td>2</td>
                        <td>Мамаюнусов Илхом Тахирович</td>
                        <td>Руководитель направлений "Проектирование информационных систем", "Электротехника", "Мехатроника и Технология машиностроения"</td>
                        <td>i.mamayunusov@kiut.uz</td>
                        <td>144</td>
                    </tr>

                    <tr>
                        <td>3</td>
                        <td>Ахмедов Жобир Мохиржонович</td>
                        <td>Руководитель направлений "Лечебное дело" и "Стоматология"</td>
                        <td>12.1-06_AJM_1@kiut.uz</td>
                        <td>169</td>
                    </tr>

                    <tr>
                        <td>4</td>
                        <td>Саидов Камолиддин Бахрамбекович</td>
                        <td>Руководитель направлений "Архитектура и градостроительство", "Строительство", "Живопись"</td>
                        <td>k.saidov@kiut.uz</td>
                        <td>131</td>
                    </tr>

                    <tr>
                        <td>5</td>
                        <td>Бердикулов Машраб Аликулович</td>
                        <td>Руководитель направлений «Управление бизнесом», «Международные экономические отношения»</td>
                        <td>m.berdikulov@kiut.uz</td>
                        <td>132</td>
                    </tr>

                    <tr>
                        <td>6</td>
                        <td>Бутаев Уткирбек</td>
                        <td>Руководитель направлений "Английское образование", "Переводоведение (китайский, английский)"</td>
                        <td>o.botayev@kiut.uz</td>
                        <td>160</td>
                    </tr>

                    <tr>
                        <td>7</td>
                        <td>Мейлиев Нурбек Хайруллаевич</td>
                        <td>Руководитель направлений "Туризм", "Международный маркетинг", "История"</td>
                        <td>n.meyliyev@kiut.uz</td>
                        <td>130</td>
                    </tr>

                    <tr>
                        <td>8</td>
                        <td>Восиков Улугбек Алишерович</td>
                        <td>Руководитель заочного отделения</td>
                        <td>u.vosiqov@kiut.uz</td>
                        <td>128, 163, 164</td>
                    </tr>

                    <tr>
                        <td>9</td>
                        <td>Аллакулиев Акмал Балтаевич</td>
                        <td>Начальник отдела магистратуры</td>
                        <td>a.allakuliyev@kiut.uz</td>
                        <td>137</td>
                    </tr>

                    <tr>
                        <td>10</td>
                        <td>Ташмуратов Умид Абдуллажанович</td>
                        <td>Руководитель направлений "Возобновляемая энергия", "Лифтостроение"</td>
                        <td>u.tashmuratov@kiut.uz</td>
                        <td>144</td>
                    </tr>

                    <tr>
                        <td>11</td>
                        <td>Ким Юн Хой</td>
                        <td>Руководитель направления "Корейская филология"</td>
                        <td>y.hoe@kiut.uz</td>
                        <td>125</td>
                    </tr>

                    <tr>
                        <td>12</td>
                        <td>Иброхимов Илхомжон Шавкатжон угли</td>
                        <td>Руководитель вечернего отделения</td>
                        <td>i.ibroximov@kiut.uz</td>
                        <td>215</td>
                    </tr>

                    <tr>
                        <td>13</td>
                        <td>Восиков Абдувахоб Равшан угли</td>
                        <td>Руководитель направлений "Финансы", "Банковское дело", "Бухгалтерия"</td>
                        <td>a.vosiqov@kiut.uz</td>
                        <td>122</td>
                    </tr>

                    <tr>
                        <td colSpan="5" style={{background:"#f1eeee"}} className="text-center fw-bold">Заведующие кафедрой</td>
                    </tr>

                    <tr>
                        <td>1</td>
                        <td>Сагидуллаев Халмурза Сапарбаевич</td>
                        <td>Заведующий кафедрой "Точные науки"</td>
                        <td>kh.sagidullayev@kiut.uz</td>
                        <td>147</td>
                    </tr>

                    <tr>
                        <td>2</td>
                        <td>Сабиров Шерзод Тахирович</td>
                        <td>Заведующий кафедрой "Информационные технологии"</td>
                        <td>sh.sabirov@kiut.uz</td>
                        <td>145</td>
                    </tr>

                    <tr>
                        <td>3</td>
                        <td>Эргашева Дурдона Азимджоновна</td>
                        <td>Заведующий кафедрой "Корейской филологии"</td>
                        <td>d.ergasheva@kiut.uz</td>
                        <td>139</td>
                    </tr>

                    <tr>
                        <td>4</td>
                        <td>Ахмедов Омонуллохон Мидхадович</td>
                        <td>Заведующий кафедрой "Международная экономика"</td>
                        <td>o.axmedov@kiut.uz</td>
                        <td>140</td>
                    </tr>

                    <tr>
                        <td>5</td>
                        <td>Бердиева Мукаррама Анваровна</td>
                        <td>Заведующий кафедрой "Русский язык"</td>
                        <td>m.berdiyeva@kiut.uz</td>
                        <td>149</td>
                    </tr>

                    <tr>
                        <td>6</td>
                        <td>Исраилов Адхам Усмон угли</td>
                        <td>Заведующий кафедрой "Туризм"</td>
                        <td>a.Isroilov@kiut.uz</td>
                        <td>152,161</td>
                    </tr>

                    <tr>
                        <td>7</td>
                        <td>Абдивахидов Камалиддин Абдихалилович</td>
                        <td>Заведующий кафедрой “Энергетика и прикладные науки”</td>
                        <td>k.abdivaxidov@kiut.uz</td>
                        <td>165</td>
                    </tr>

                    <tr>
                        <td>8</td>
                        <td>Товмасян Элина Арменовна</td>
                        <td>Заведующий кафедрой "Английского образования"</td>
                        <td>e.tovmasyan@kiut.uz</td>
                        <td>138</td>
                    </tr>

                    <tr>
                        <td>9</td>
                        <td>Хатамов Алижан Иброгимжанович</td>
                        <td>Заведующий кафедрой "Фундаментальные медицинские науки"</td>
                        <td>a.xatamov@kiut.uz</td>
                        <td>167</td>
                    </tr>

                    <tr>
                        <td>10</td>
                        <td>Инамов Боходир Низамович</td>
                        <td>Заведующий кафедрой "Строительство"</td>
                        <td>b.inamov@kiut.uz</td>
                        <td>166</td>
                    </tr>

                    <tr>
                        <td>11</td>
                        <td>Юсупов Жамбул Русланович</td>
                        <td>Заведующий кафедрой "Прикладная информатика"</td>
                        <td>j.yusupov@kiut.uz</td>
                        <td>136</td>
                    </tr>

                    <tr>
                        <td>12</td>
                        <td>Исаметдинова Шахло Авазджановна</td>
                        <td>Заведующий кафедрой "Архитектура и градостроительство"</td>
                        <td>sh.isametdinova@kiut.uz</td>
                        <td>127</td>
                    </tr>

                    <tr>
                        <td>13</td>
                        <td>Элмуродов Шохжахон Гайрат угли</td>
                        <td>Заведующий кафедрой</td>
                        <td>sh.elmurodov@kiut.uz</td>
                        <td>156</td>
                    </tr>

                    <tr>
                        <td>14</td>
                        <td>Садикова Севара Абдумаликовна</td>
                        <td>Заведующий кафедрой "Дизайн одежды"</td>
                        <td>s.sadikova@kiut.uz</td>
                        <td>167</td>
                    </tr>

                    <tr>
                        <td>15</td>
                        <td>Додиев Фозил Уткурович</td>
                        <td>Банковское дело и бухгалтерский учет</td>
                        <td>f.dodiyev@kiut.uz</td>
                        <td>174</td>
                    </tr>

                    <tr>
                        <td>16</td>
                        <td>Альмяшева Лиана Адхамовна</td>
                        <td>Заведующий кафедрой "Живопись"</td>
                        <td>l.almyasheva@kiut.uz</td>
                        <td>--</td>
                    </tr>

                    <tr>
                        <td>17</td>
                        <td>Мирзарахметова Дилбар Тохтамуратовна</td>
                        <td>Заведующий кафедрой "Химия и биология"</td>
                        <td>d.mirzaraxmetova@kiut.uz</td>
                        <td>0</td>
                    </tr>

                    <tr>
                        <td>18</td>
                        <td>Джумаев Тулкин Холмуродович</td>
                        <td>Заведующий кафедрой "Социально-гуманитарные науки"</td>
                        <td>t.jumayev@kiut.uz</td>
                        <td>150</td>
                    </tr>

                    <tr>
                        <td>19</td>
                        <td>Газиходжаева Наргиза Миразизовна</td>
                        <td>Заведующий кафедрой "Прикладная косметология"</td>
                        <td>13.05_GNM_1@kiut.uz</td>
                        <td>--</td>
                    </tr>

                    <tr>
                        <td>20</td>
                        <td>Рустамов Акмал Сухробович</td>
                        <td>Заведующий кафедрой "Технология машиностроения"</td>
                        <td>akmal.rustamov@kiut.uz</td>
                        <td>--</td>
                    </tr>

                    <tr>
                        <td>21</td>
                        <td>Ибрагимов Иномжон Хусаинович</td>
                        <td>Заведующий кафедрой "Физика"</td>
                        <td>i.ibragimov@kiut.uz</td>
                        <td>--</td>
                    </tr>

                    <tr>
                        <td>22</td>
                        <td>Юнусов Абдувохид Гофурович</td>
                        <td>Заведующий кафедрой «Инженерия и управление дорожным движением»</td>
                        <td>a.yunusov@kiut.uz</td>
                        <td>--</td>
                    </tr>

                    <tr>
                        <td>23</td>
                        <td>Шарипова Зебо Бекмуродовна</td>
                        <td>Заведующий кафедрой "Менеджмент и маркетинг"</td>
                        <td>z.sharipova@ytit.uz</td>
                        <td>--</td>
                    </tr>

                    <tr>
                        <td>24</td>
                        <td>Одилова Гулноза Комилжоновна</td>
                        <td>Заведующий кафедрой "Теория и практика перевода"</td>
                        <td>g.odilova@kiut.uz</td>
                        <td>--</td>
                    </tr>

                    <tr>
                        <td>25</td>
                        <td>Рахматова Мукаддас  Холтаевна</td>
                        <td>Заведующий кафедрой “Медико-биологических дисциплин”</td>
                        <td>m.rahmatova@kiut.uz</td>
                        <td>--</td>
                    </tr>

                    <tr>
                        <td>26</td>
                        <td>Турсунова Дилфуза Шавкатовна</td>
                        <td>Заведующий кафедрой “Английского языка”</td>
                        <td>d.tursunova@kiut.uz</td>
                        <td>--</td>
                    </tr>

                    <tr>
                        <td>27</td>
                        <td>Холйигитова Насиба Хабибуллаевна</td>
                        <td>Заведующий кафедрой «Педагогика и психология»</td>
                        <td>n.xolyigitova@kiut.uz</td>
                        <td>220</td>
                    </tr>

                    <tr>
                        <td>28</td>
                        <td>Рустамова Манзура Миркамаловна</td>
                        <td>Заведующий кафедрой "Методика дошкольного и начального образования"</td>
                        <td>m.rustamova@kiut.uz</td>
                        <td>155</td>
                    </tr>

                    <tr>
                        <td>29</td>
                        <td>Замонов Aкбар Тургинович</td>
                        <td>Заведующий кафедрой “История”</td>
                        <td>a.zamonov@kiut.uz</td>
                        <td>--</td>
                    </tr>

                    <tr>
                        <td colSpan="5" style={{background:"#f1eeee"}} className="text-center fw-bold">Руководители отделов</td>
                    </tr>

                    <tr>
                        <td>1</td>
                        <td>Сулаймонов Фаррух Шухратович</td>
                        <td>Начальник отдела кадров</td>
                        <td>hr@kiut.uz</td>
                        <td>114</td>
                    </tr>

                    <tr>
                        <td>2</td>
                        <td>Исамова Гульчехрабону Марвар кизи</td>
                        <td>Руководитель научного отдела</td>
                        <td>g.isamova@kiut.uz</td>
                        <td>121</td>
                    </tr>

                    <tr>
                        <td>3</td>
                        <td>Абдулкасимов Ислам</td>
                        <td>Менеджер по техническому снабжению</td>
                        <td>i.abdulkasimov@kiut.uz</td>
                        <td>122</td>
                    </tr>

                    <tr>
                        <td>4</td>
                        <td>Ли Илларион Георгиевич</td>
                        <td>Руководитель центра информационных технологий</td>
                        <td>leeig@kiut.uz</td>
                        <td>107</td>
                    </tr>

                    <tr>
                        <td>5</td>
                        <td>Хамраева Шоира</td>
                        <td>Руководитель отдела по работе с общественностью</td>
                        <td>sh.xamrayeva@kiut.uz</td>
                        <td>159</td>
                    </tr>

                    <tr>
                        <td>6</td>
                        <td>Рахматиллаев Сарварбек</td>
                        <td>Начальник отдела по Международному сотрудничеству</td>
                        <td>s.rakhmatillaev@kiut.uz</td>
                        <td>126</td>
                    </tr>

                    <tr>
                        <td>7</td>
                        <td>Мирзахмедов Мирякуб Миряхяевич</td>
                        <td>Руководитель отдела по работе со студентами</td>
                        <td>m.mirzakhmedov@kiut.uz</td>
                        <td>158</td>
                    </tr>

                    <tr>
                        <td>8</td>
                        <td>Аллаберганов Роман Курамбаевич</td>
                        <td>Руководитель Академического отдела</td>
                        <td>ark@kiut.uz</td>
                        <td>123, 116</td>
                    </tr>

                    <tr>
                        <td>9</td>
                        <td>Курбанбаев Джорабек Эрувбаевич</td>
                        <td>Начальник отдела бухгалтерии</td>
                        <td>j.kurbanbayev@kiut.uz</td>
                        <td>118, 119</td>
                    </tr>

                    <tr>
                        <td>10</td>
                        <td>Ахмедова Нигора Алижановна</td>
                        <td>Руководитель Информационно-ресурсного центра</td>
                        <td>n.axmedova@kiut.uz</td>
                        <td>112, 142</td>
                    </tr>

                    <tr>
                        <td>11</td>
                        <td>Кадыров Рафик Хусанович</td>
                        <td>Начальник отдела по внедрению учебных планов и программ</td>
                        <td>r.kadirov@kiut.uz</td>
                        <td>--</td>
                    </tr>

                    <tr>
                        <td>12</td>
                        <td>Сатторов Алишер Хасан угли</td>
                        <td>Руководитель центра непрерывного образования</td>
                        <td>a.sattorov@kiut.uz</td>
                        <td>147</td>
                    </tr>

                    <tr>
                        <td>13</td>
                        <td>Садикова Дилфуза Илхомджановна</td>
                        <td>Начальник отдела канцелярии университета</td>
                        <td>d.sadikova@kiut.uz</td>
                        <td>100</td>
                    </tr>

                    <tr>
                        <td>14</td>
                        <td>Абдужамилова Мавлуда Мурадовна</td>
                        <td>Начальник отдела контроля качества образования</td>
                        <td>m.abdujamilova@kiut.uz</td>
                        <td>178</td>
                    </tr>

                    <tr>
                        <td>15</td>
                        <td>Полвонов Элмурод Дилмурод угли</td>
                        <td>Руководитель инновационного центра</td>
                        <td>13.11_PED_1@kiut.uz</td>
                        <td>--</td>
                    </tr>

                    <tr>
                        <td>16</td>
                        <td>Арипов Азиз Казимджанович</td>
                        <td>Руководитель отдела Маркетинга и по работе с выпускниками</td>
                        <td>a.aripov@kiut.uz</td>
                        <td>200</td>
                    </tr>

                    </tbody>
                </table>
            </Bodybox>
        </Container>
    );
}

const Bodybox = styled.div`
  margin-top: 25px;
  width: 100%;
  overflow-x: scroll;
  

  table {
    min-width: 700px;
    border-collapse: collapse;
    width: 100%;
    border-radius: 5px;
    overflow: hidden;

    td, th {
      border: 1px solid #ddd;
      padding: 8px;
      font-size: 15px;
    }

    th {
      text-align: center;
    }

    tr {
      &:nth-child(even) {
        background-color: #fcf9f9;
      }
    }

    th {
      background-color: ${mainColor};
      color: white;
    }
  }

`;

const Container=styled.div`
padding: 1rem;
`
export default AllContacts;
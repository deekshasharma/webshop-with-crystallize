import React from 'react';
import Link from 'next/link';
import { useT } from 'lib/i18n';
import { useSettings } from 'components/settings-context';
import { Outer, Logo, NavList, Social } from './styles';

export default function Footer() {
  const t = useT();
  const { mainNavigation } = useSettings();

  return (
    <Outer>
      <Link href="/">
        <a>
          <Logo>
            <img src="/static/shop-logo.svg" alt="" width="56" height="84" />
          </Logo>
        </a>
      </Link>
      <p>© 2021 Kahn, Inc. All rights reserved.</p>
      <Social>
        <a href={"https://facebook.com"} target="_blank">
          <img src="/static/fb.svg" alt="facebook"/>
        </a>
        <a href={"https://instagram.com"} target="_blank">
          <img src="/static/insta.svg" alt="instagram"/>
        </a>
      </Social>
      <NavList>
        <h5>{t('layout.menu')}</h5>
        {mainNavigation?.map((category) => (
          <li key={category.path}>
            <Link href={category.path}>
              <a>{category.name}</a>
            </Link>
          </li>
        ))}
      </NavList>

    </Outer>
  );
}

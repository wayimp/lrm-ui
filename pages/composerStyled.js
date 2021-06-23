import styled from 'styled-components'

export const List = styled.div`
  border: 1px ${props => (props.isDraggingOver ? 'dashed #000' : 'solid #ddd')};
  background: #fff;
  padding: 0.5rem 0.5rem 0;
  border-radius: 3px;
  flex: 0 0 150px;
  font-family: sans-serif;
`
export const Notice = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 0.5rem;
  margin: 0 0.5rem 0.5rem;
  border: 1px solid transparent;
  line-height: 1.5;
  color: #aaa;
`;

export const Kiosk = styled(List)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 200px;
`

export const Item = styled.div`
  user-select: none;
  padding: 16px;
  margin: 0px 0px 8px;
`

export const Clone = styled(Item)`
  ~ div {
    transform: none !important;
  }
`

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 15px;

  @media screen and (min-width: 992px) {
    flex-direction: row;
    align-items: flex-start;
  }

  .profile-spinner {
    width: 100%;
    min-height: 50vh;
    display: flex;

    align-items: center;
    justify-content: center;
  }

  .header-description {
    flex: 2;
    min-height: 100px;
    text-align: center;

    @media screen and (min-width: 992px) {
      text-align: left;
    }

    .header-title {
      display: flex;
      min-height: 70px;

      .header-name {
        flex: 4;

        h1 {
          margin: 0px;
        }
      }
    }

    .header-label {
      min-height: 25px;
      font-size: 13px;
      font-weight: 600;

      p {
        margin-bottom: 0px;
      }

      @media screen and (min-width: 576px) {
        font-size: 14px;
      }

      i {
        border: 1px solid var(--info-color);
        padding: 3px;
        border-radius: 50%;
        font-size: 14px;
      }

      i.friends {
        border: 1px solid var(--primary-color);
      }

      i.blocked {
        border: 1px solid var(--danger-color);
      }

      p {
        margin-left: 5px;
      }
      span {
        font-weight: 600;
      }
    }
  }

  .header-menu {
    flex: 1;

    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 5px;

    @media screen and (min-width: 992px) {
      align-items: flex-end;
    }

    .menu-label {
      min-height: 25px;
      text-align: center;
      font-size: 13px;
      font-weight: 600;

      p {
        margin-bottom: 0px;
      }

      i {
        font-size: 14px;
        margin-right: 5px;
      }

      @media screen and (min-width: 576px) {
        font-size: 14px;
      }

      span {
        font-weight: 600;
      }

      @media screen and (min-width: 992px) {
        text-align: left;
      }
    }

    .menu-buttons {
      display: flex;
      align-items: center;
      min-height: 70px;

      .p-button {
        margin-right: 10px;

        :last-child {
          margin-right: 5px;
        }
      }

      .p-buttonset {
        margin-right: 10px;

        .p-button {
          margin-right: 0px;
        }

        & button:enabled:hover:not(:last-child) {
          border-right: 0 none;
        }
      }

      .p-button-label {
        display: none;
        visibility: hidden;
      }

      .p-button-icon-left {
        margin-right: 0px;
      }

      @media screen and (min-width: 576px) {
        .p-button-label {
          display: initial;
          visibility: visible;
        }

        .p-button-icon-left {
          margin-right: 0.5em;
        }
      }

      .menu-spinner .p-progress-spinner {
        width: 30px;
        height: 30px;
      }
    }
  }
`
